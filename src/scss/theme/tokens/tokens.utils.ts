/**
 * Minimal reader for the custom properties declared in the token layers. Used by the
 * token tests, and by the charte rules planned for the CLI `check` command.
 */

const DECLARATION = /--([a-z0-9-]+)\s*:\s*([^;{}]+);/gi;
const VAR_REFERENCE = /var\(\s*--([a-z0-9-]+)/gi;

function stripComments(scss: string): string {
    return scss
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/(^|\s)\/\/[^\n]*/g, '$1');
}

/** Declaration order is preserved; a later declaration of the same name wins. */
export function parseCustomProperties(scss: string): Map<string, string> {
    const properties = new Map<string, string>();
    for (const [, name, value] of stripComments(scss).matchAll(DECLARATION)) {
        properties.set(name, value.trim());
    }
    return properties;
}

export function varRefs(value: string): string[] {
    return [...value.matchAll(VAR_REFERENCE)].map(([, name]) => name);
}

export interface TokenBlock {
    selector: string;
    properties: Map<string, string>;
}

const RULE = /([^{}]+)\{([^{}]*)\}/g;

/**
 * Split compiled CSS into its rule blocks, keeping only the custom properties. Used to
 * assert how the token layers resolve, which the flat property map cannot express.
 */
export function parseBlocks(css: string): TokenBlock[] {
    const blocks: TokenBlock[] = [];
    for (const [, prelude, body] of stripComments(css).matchAll(RULE)) {
        const properties = parseCustomProperties(body);
        if (properties.size > 0) {
            // The prelude can trail a statement at-rule such as `@charset "UTF-8";`;
            // the selector is whatever follows the last one.
            const selector = prelude.split(';').pop()!.trim();
            blocks.push({ selector, properties });
        }
    }
    return blocks;
}
