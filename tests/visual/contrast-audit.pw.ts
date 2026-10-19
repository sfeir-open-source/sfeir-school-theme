import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { PROGRAMS, openDeck, gotoSlide } from './deck';

/**
 * WCAG contrast audit of every visible text node of every slide, per program.
 *
 * Writes tests/visual/reports/contrast-<program>.json and prints a summary. It does not
 * assert by default (the report is the deliverable); set CONTRAST_STRICT=1 to fail on
 * any failure below the threshold.
 *
 * Thresholds (WCAG 2.x AA): 4.5 for text, 3.0 for large text, i.e. rendered size
 * >= 24px, or >= 18.66px at weight >= 700. Sizes are measured after Reveal's scale.
 *
 * Background resolution, per text node: walk up the ancestors to the slide `<section>`
 * compositing every non-transparent background-color; then the slide's
 * the column's own background on a `tc-multiple-columns` slide, then
 * `.slide-background` (+ its content layer), then the deck layers `.backgrounds`,
 * `.reveal`, `body`, `html`. A background-image anywhere on the ancestors or on the
 * slide background marks the node `image` and skips it; a background-image on the deck
 * layers is ignored on purpose (that is the SFEIR logo watermark in a corner).
 */

interface ContrastFailure {
    slide: string;
    h: number;
    v: number;
    path: string;
    text: string;
    occurrences: number;
    fg: string;
    bg: string;
    ratio: number;
    required: number;
    fontSizePx: number;
    fontWeight: number;
}

interface SlideAudit {
    slide: string;
    h: number;
    v: number;
    textNodes: number;
    imageSkipped: number;
    failures: ContrastFailure[];
}

const REPORT_DIR = path.join(__dirname, 'reports');

for (const program of PROGRAMS) {
    test(`contrast audit - ${program}`, async ({ page }, testInfo) => {
        const slides = await openDeck(page, program);
        const audits: SlideAudit[] = [];

        for (const slide of slides) {
            await gotoSlide(page, slide);
            const audit = await page.evaluate(auditCurrentSlide, {
                slide: slide.name,
                h: slide.h,
                v: slide.v,
            });
            audits.push(audit);
        }

        const failures = audits.flatMap((a) => a.failures);
        const report = {
            program,
            generatedAt: new Date().toISOString(),
            viewport: testInfo.project.use.viewport,
            slides: audits.length,
            textNodes: audits.reduce((n, a) => n + a.textNodes, 0),
            imageSkipped: audits.reduce((n, a) => n + a.imageSkipped, 0),
            failingNodes: failures.reduce((n, f) => n + f.occurrences, 0),
            failingSlides: audits.filter((a) => a.failures.length > 0).length,
            failures,
        };

        mkdirSync(REPORT_DIR, { recursive: true });
        const file = path.join(REPORT_DIR, `contrast-${program}.json`);
        writeFileSync(file, JSON.stringify(report, null, 2));

        const lines = [
            `[contrast:${program}] ${report.slides} slides, ${report.textNodes} text nodes, ` +
                `${report.imageSkipped} skipped (image bg), ${report.failingNodes} failing nodes ` +
                `on ${report.failingSlides} slides -> ${path.relative(process.cwd(), file)}`,
            ...failures.map(
                (f) =>
                    `  ${f.slide} ${f.path} ${f.fg} on ${f.bg} = ${f.ratio.toFixed(2)} ` +
                    `(need ${f.required}, ${Math.round(f.fontSizePx)}px/${f.fontWeight}) x${f.occurrences} "${f.text}"`
            ),
        ];
        console.log(lines.join('\n'));
        testInfo.annotations.push({
            type: 'contrast',
            description: `${report.failingNodes} failing nodes on ${report.failingSlides}/${report.slides} slides`,
        });

        if (process.env.CONTRAST_STRICT) {
            expect(failures, 'contrast failures').toEqual([]);
        }
    });
}

/* -------------------------------------------------------------------------- */
/* Browser side. Serialisable, no closure over Node scope.                     */
/* -------------------------------------------------------------------------- */

function auditCurrentSlide(meta: {
    slide: string;
    h: number;
    v: number;
}): SlideAudit {
    type Rgba = [number, number, number, number];

    const parseColor = (value: string): Rgba | null => {
        const m = value.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const parts = m[1]
            .split(/[\s,/]+/)
            .filter(Boolean)
            .map(Number);
        const [r, g, b, a = 1] = parts;
        return [r, g, b, Number.isFinite(a) ? a : 1];
    };
    const over = (top: Rgba, bottom: Rgba): Rgba => {
        const a = top[3] + bottom[3] * (1 - top[3]);
        if (a === 0) return [0, 0, 0, 0];
        const ch = (i: number) =>
            (top[i] * top[3] + bottom[i] * bottom[3] * (1 - top[3])) / a;
        return [ch(0), ch(1), ch(2), a];
    };
    const luminance = ([r, g, b]: Rgba) => {
        const lin = (c: number) => {
            const s = c / 255;
            return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    };
    const contrast = (a: Rgba, b: Rgba) => {
        const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
        return (l1 + 0.05) / (l2 + 0.05);
    };
    const hex = ([r, g, b]: Rgba) =>
        '#' +
        [r, g, b]
            .map((c) => Math.round(c).toString(16).padStart(2, '0'))
            .join('');

    const R = window.Reveal;
    const scale = R.getScale();
    const section = R.getCurrentSlide();
    const slideBackground = R.getSlideBackground(section) as
        | HTMLElement
        | undefined;

    /** Layers below the section, top-most first. */
    const deckLayers: { el: Element; allowImage: boolean }[] = [];
    if (slideBackground) {
        const content = slideBackground.querySelector(
            '.slide-background-content'
        );
        if (content) deckLayers.push({ el: content, allowImage: false });
        deckLayers.push({ el: slideBackground, allowImage: false });
    }
    for (const sel of ['.reveal .backgrounds', '.reveal']) {
        const el = document.querySelector(sel);
        if (el) deckLayers.push({ el, allowImage: true });
    }
    deckLayers.push({ el: document.body, allowImage: true });
    deckLayers.push({ el: document.documentElement, allowImage: true });

    type Bg = { kind: 'color'; color: Rgba } | { kind: 'image' };

    const resolveBackground = (start: Element, textRect: DOMRect): Bg => {
        const chain: { el: Element; allowImage: boolean }[] = [];
        let el: Element | null = start;
        while (el && el !== section.parentElement) {
            chain.push({ el, allowImage: false });
            el = el.parentElement;
        }
        // A `tc-multiple-columns` slide: talk-control paints each column's own
        // `data-background` on the n-th `.tc-col-section` of the slide background.
        const column = start.closest('.tc-column');
        if (column && slideBackground) {
            const index = [
                ...section.querySelectorAll(':scope > .tc-column'),
            ].indexOf(column);
            const colBg = slideBackground.querySelectorAll(
                ':scope > .tc-col-section'
            )[index];
            const content = colBg?.querySelector('.slide-background-content');
            if (content) chain.push({ el: content, allowImage: false });
            if (colBg) chain.push({ el: colBg, allowImage: false });
        }
        chain.push(...deckLayers);

        // Composite bottom-up: find the first opaque layer (or an image), then stack
        // the semi-transparent ones above it. An absolutely positioned `::before`/`::after`
        // at least as large as the text counts as a surface of its element (the speaker
        // card paints its white island that way); smaller ones are decorations (title
        // underline, bullet, logo) and are ignored. Heuristic: pseudo-element stacking is
        // not fully modelled.
        const stack: Rgba[] = [];
        const styles = (el: Element): CSSStyleDeclaration[] => {
            const own = getComputedStyle(el);
            const pseudos = ['::before', '::after']
                .map((p) => getComputedStyle(el, p))
                .filter(
                    (cs) =>
                        cs.content !== 'none' &&
                        cs.content !== '' &&
                        (cs.position === 'absolute' ||
                            cs.position === 'fixed') &&
                        parseFloat(cs.width) >= textRect.width - 1 &&
                        parseFloat(cs.height) >= textRect.height - 1
                );
            return [own, ...pseudos];
        };
        outer: for (const layer of chain) {
            for (const cs of styles(layer.el)) {
                if (cs.backgroundImage !== 'none' && !layer.allowImage)
                    return { kind: 'image' };
                const c = parseColor(cs.backgroundColor);
                if (!c || c[3] === 0) continue;
                stack.push(c);
                if (c[3] >= 1) break outer;
            }
        }
        if (stack.length === 0)
            return { kind: 'color', color: [255, 255, 255, 1] };
        let color = stack[stack.length - 1];
        if (color[3] < 1) color = over(color, [255, 255, 255, 1]);
        for (let i = stack.length - 2; i >= 0; i--)
            color = over(stack[i], color);
        return { kind: 'color', color };
    };

    const pathOf = (el: Element) => {
        const parts: string[] = [];
        let cur: Element | null = el;
        while (cur && cur !== section.parentElement) {
            const cls = [...cur.classList]
                .filter(
                    (c) =>
                        ![
                            'present',
                            'past',
                            'future',
                            'visible',
                            'current-fragment',
                            'tc-specific-slide',
                            'has-dark-background',
                            'has-light-background',
                        ].includes(c)
                )
                .slice(0, 3)
                .map((c) => `.${c}`)
                .join('');
            parts.unshift(`${cur.tagName.toLowerCase()}${cls}`);
            cur = cur.parentElement;
        }
        return parts.slice(-5).join(' > ');
    };

    /** Rect of the rendered text, or null when it is not visible on screen. */
    const renderedRect = (node: Text, el: Element): DOMRect | null => {
        const range = document.createRange();
        range.selectNodeContents(node);
        const rect = range.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return null;
        if (
            rect.bottom < 0 ||
            rect.right < 0 ||
            rect.top > innerHeight ||
            rect.left > innerWidth
        )
            return null;
        let cur: Element | null = el;
        while (cur && cur !== section.parentElement) {
            const cs = getComputedStyle(cur);
            if (
                cs.visibility === 'hidden' ||
                cs.display === 'none' ||
                parseFloat(cs.opacity) === 0
            )
                return null;
            cur = cur.parentElement;
        }
        return rect;
    };

    // Icon-font ligatures (`<i class="tc-icons">android</i>`) are glyphs, not text:
    // WCAG text contrast does not apply to them.
    const ICON_SELECTOR =
        '.tc-icons, [class*="material-symbols"], .material-icons, .fa, .fas, .far, .fab, [data-feather]';

    const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
            if (!node.textContent || !node.textContent.trim())
                return NodeFilter.FILTER_REJECT;
            const parent = node.parentElement;
            if (
                !parent ||
                ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(
                    parent.tagName
                )
            ) {
                return NodeFilter.FILTER_REJECT;
            }
            if (parent.closest(ICON_SELECTOR)) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
        },
    });

    const failures = new Map<string, ContrastFailure>();
    let textNodes = 0;
    let imageSkipped = 0;

    for (
        let node = walker.nextNode() as Text | null;
        node;
        node = walker.nextNode() as Text | null
    ) {
        const el = node.parentElement!;
        const textRect = renderedRect(node, el);
        if (!textRect) continue;
        textNodes++;

        const cs = getComputedStyle(el);
        const fill = cs.webkitTextFillColor;
        let fg =
            parseColor(fill && fill !== 'currentcolor' ? fill : cs.color) ??
            parseColor(cs.color);
        if (!fg) continue;

        const bg = resolveBackground(el, textRect);
        if (bg.kind === 'image') {
            imageSkipped++;
            continue;
        }
        if (fg[3] < 1) fg = over(fg, bg.color);

        const fontSizePx = parseFloat(cs.fontSize) * scale;
        const fontWeight =
            cs.fontWeight === 'bold'
                ? 700
                : cs.fontWeight === 'normal'
                  ? 400
                  : parseInt(cs.fontWeight, 10) || 400;
        const large =
            fontSizePx >= 24 || (fontSizePx >= 18.66 && fontWeight >= 700);
        const required = large ? 3 : 4.5;
        const ratio = contrast(fg, bg.color);
        if (ratio >= required) continue;

        const p = pathOf(el);
        const key = `${p}|${hex(fg)}|${hex(bg.color)}|${ratio.toFixed(2)}`;
        const existing = failures.get(key);
        if (existing) {
            existing.occurrences++;
        } else {
            failures.set(key, {
                slide: meta.slide,
                h: meta.h,
                v: meta.v,
                path: p,
                text: node
                    .textContent!.trim()
                    .replace(/\s+/g, ' ')
                    .slice(0, 60),
                occurrences: 1,
                fg: hex(fg),
                bg: hex(bg.color),
                ratio: Math.round(ratio * 100) / 100,
                required,
                fontSizePx: Math.round(fontSizePx * 10) / 10,
                fontWeight,
            });
        }
    }

    return {
        slide: meta.slide,
        h: meta.h,
        v: meta.v,
        textNodes,
        imageSkipped,
        failures: [...failures.values()],
    };
}
