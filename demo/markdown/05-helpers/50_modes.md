<!-- .slide: class="transition" -->

# Slides using hidden slides

##==##

# Slides using hidden slides

We can configure some slides and it's HTML to display or hidde some slides

##==##

<!-- .slide: data-type-show="prez" -->

## A slide for prez only

A few words !

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
<!-- .slide: data-type-show="prez" -->

For slide present on presentation

<!-- .slide: data-type-show="full" -->

For slide present on restitution version

To configure with index.html
```

##==##

<!-- .slide: data-type-show="full other" -->

## A slide for publication only

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec risus leo. Vestibulum condimentum orci in urna auctor aliquet. Quisque mi erat, placerat non porttitor ut, gravida eu erat. Fusce semper ipsum vel nibh porttitor aliquam. Cras sed porttitor est, id scelerisque odio. Pellentesque sit amet imperdiet ex. Aliquam erat.

##==##

<!-- .slide: class="transition" -->

# Internationalization

##==##

# Internationalization

We can provide slides in different languages. Just write several versions of each markdown file (e.g., `00_intro.md` and `00_intro.EN.md`).

To select the language to be used, you can

-   set the language in index.html by setting the HTML attribute `data-lang`; or
-   pick the language when presenting by setting the URL parameter lang.

The URL parameter takes precedence over the HTML attribute.

For instance, add `?data-lang=fr` or `&data-lang=fr` to the URL before the hash sign to switch to the French version of this presentation (only the introduction slides are translated)
