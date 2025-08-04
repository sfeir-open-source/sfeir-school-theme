<!-- .slide: class="transition" -->

# Slides using helpers of theme

##==##

# Slide with center image (horizontal)

## First way

![](./assets/images/GDG-Logo-carre.png 'center')

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
![](./assets/images/GDG-Logo-carre.png 'center')
```

<!-- .element: class="big-code" -->

##==##

# Slide with center image (horizontal)

## Second way

<img class="center" src="./assets/images/GDG-Logo-carre.png">

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
<img class="center" src="./assets/images/GDG-Logo-carre.png">
```

<!-- .element: class="big-code" -->

##==##

# Slide with center image (horizontal & vertical)

## First way

<div class="full-center">
    <img src="./assets/images/GDG-Logo-carre.png">
</div>

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
<div class="full-center">
    <img src="./assets/images/GDG-Logo-carre.png">
</div>
```

<!-- .element: class="big-code" -->

##==##

<!-- .slide: class="full-center" -->

# Slide with center image (horizontal & vertical)

## Second way

![](./assets/images/GDG-Logo-carre.png)

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
<!-- .slide: class="full-center" -->

![](./assets/images/GDG-Logo-carre.png)
```

<!-- .element: class="big-code" -->

##==##

<!-- .slide: class="flex-row" -->

# Flex row alignement with auto wrap

## First way

![](./assets/images/GDG-Logo-carre.png 'h-200')
![](./assets/images/GDG-Logo-carre.png 'h-250')
![](./assets/images/GDG-Logo-carre.png 'h-300')
![](./assets/images/GDG-Logo-carre.png 'h-200')
![](./assets/images/GDG-Logo-carre.png 'h-350')
![](./assets/images/GDG-Logo-carre.png 'h-300')
![](./assets/images/GDG-Logo-carre.png 'h-350')
![](./assets/images/GDG-Logo-carre.png 'h-200')
![](./assets/images/GDG-Logo-carre.png 'h-100')

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
<!-- .slide: class="flex-row" -->

![](./assets/images/GDG-Logo-carre.png 'h-200')
![](./assets/images/GDG-Logo-carre.png 'h-250')
![](./assets/images/GDG-Logo-carre.png 'h-300')
![](./assets/images/GDG-Logo-carre.png 'h-200')
![](./assets/images/GDG-Logo-carre.png 'h-350')
![](./assets/images/GDG-Logo-carre.png 'h-300')
![](./assets/images/GDG-Logo-carre.png 'h-350')
![](./assets/images/GDG-Logo-carre.png 'h-200')
![](./assets/images/GDG-Logo-carre.png 'h-100')
```

##==##

# Flex row alignement with auto wrap

## Second way

<div class="flex-row">
<img class="h-200" src="./assets/images/GDG-Logo-carre.png">
<img class="h-250" src="./assets/images/GDG-Logo-carre.png">
<img class="h-300" src="./assets/images/GDG-Logo-carre.png">
<img class="h-200" src="./assets/images/GDG-Logo-carre.png">
<img class="h-350" src="./assets/images/GDG-Logo-carre.png">
<img class="h-300" src="./assets/images/GDG-Logo-carre.png">
<img class="h-350" src="./assets/images/GDG-Logo-carre.png">
<img class="h-200" src="./assets/images/GDG-Logo-carre.png">
<img class="h-100" src="./assets/images/GDG-Logo-carre.png">
</div>

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
<div class="flex-row">
<img class="h-200" src="./assets/images/GDG-Logo-carre.png">
<img class="h-250" src="./assets/images/GDG-Logo-carre.png">
<img class="h-300" src="./assets/images/GDG-Logo-carre.png">
<img class="h-200" src="./assets/images/GDG-Logo-carre.png">
<img class="h-350" src="./assets/images/GDG-Logo-carre.png">
<img class="h-300" src="./assets/images/GDG-Logo-carre.png">
<img class="h-350" src="./assets/images/GDG-Logo-carre.png">
<img class="h-200" src="./assets/images/GDG-Logo-carre.png">
<img class="h-100" src="./assets/images/GDG-Logo-carre.png">
</div>
```

##==##

# Play with images sizes

## Image from 50px to 1000px (width and height)

Image (w-500) :

![](./assets/images/350x90.png 'w-500')

Div background:

<div style="background:red;" class="w-500 h-200"> w-500 h-200</div>

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
![](./assets/images/350x90.png 'w-500')

<div style="background:red;" class="w-500 h-200"> w-500 h-200</div>
```

<!-- .element: class="big-code" -->

##==##

# Play with images max-sizes

## Image from 50px to 1000px (max-width and max-height)

Image :

![](./assets/images/350x90.png 'wm-500')

Div background:

<div style="background:red; width:600px;" class="wm-500 h-200"> (height:600px) wm-500 h-200</div>

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
![](./assets/images/350x90.png 'wm-500')

<div style="background:red; width:600px;" class="wm-500 h-200"> 
    (height:600px) wm-500 h-200</div>
```

<!-- .element: class="big-code" -->

##==##

<!-- .slide: class="flex-row" -->

# Play with margin top or bottom

<br><br>

<div class="flex-row">

![](./assets/images/GDG-Logo-carre.png 'h-200 mt-430')

![](./assets/images/GDG-Logo-carre.png 'h-200 mt-150')

![](./assets/images/GDG-Logo-carre.png 'h-200 mt-50')

![](./assets/images/GDG-Logo-carre.png 'h-200 mt-10')

![](./assets/images/GDG-Logo-carre.png 'h-200')

![](./assets/images/GDG-Logo-carre.png 'h-200 mb-10')

![](./assets/images/GDG-Logo-carre.png 'h-200 mb-50')

![](./assets/images/GDG-Logo-carre.png 'h-200 mb-160')

![](./assets/images/GDG-Logo-carre.png 'h-200 mb-430')

</div>

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
<!-- .slide: class="flex-row" -->

![](./assets/images/GDG-Logo-carre.png 'h-200 mt-430')
![](./assets/images/GDG-Logo-carre.png 'h-200 mt-150')
![](./assets/images/GDG-Logo-carre.png 'h-200 mt-50')
![](./assets/images/GDG-Logo-carre.png 'h-200 mt-10')
![](./assets/images/GDG-Logo-carre.png 'h-200')
![](./assets/images/GDG-Logo-carre.png 'h-200 mb-10')
![](./assets/images/GDG-Logo-carre.png 'h-200 mb-50')
![](./assets/images/GDG-Logo-carre.png 'h-200 mb-160')
![](./assets/images/GDG-Logo-carre.png 'h-200 mb-430')
```

##==##

# Image with full width

## First way

![](./assets/images/Sfeir-Gris-vector.svg 'full-width')

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
![](./assets/images/Sfeir-Gris-vector.svg 'full-width')
```

<!-- .element: class="big-code" -->

##==##

# Image with full width

## Second way

<img class="full-width" src="./assets/images/Sfeir-Gris-vector.svg">

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
<img class="full-width" src="./assets/images/Sfeir-Gris-vector.svg">
```

<!-- .element: class="big-code" -->

##==##

<!-- .slide: style="height:100%" -->

# Image with full height

Div with height of 600px;

<div style="height:600px; width:100%; border: dashed 3px grey;">
    <img class="full-height" src="./assets/images/Sfeir-Gris-vector.svg">
</div>

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
<!-- .slide: style="height:100%" -->

<div style="height:600px; width:100%; border: dashed 3px grey;">
    <img class="full-height" src="./assets/images/Sfeir-Gris-vector.svg">
</div>
```

<!-- .element: class="big-code" -->

##==##

# Content with float-left

## First way

![](./assets/images/gde.png 'float-left')

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec risus leo. Vestibulum condimentum orci in urna auctor aliquet. Quisque mi erat, placerat non porttitor ut, gravida eu erat. Fusce semper ipsum vel nibh porttitor aliquam. Cras sed porttitor est, id scelerisque odio. Pellentesque sit amet imperdiet ex. Aliquam erat.

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
![](./assets/images/gde.png 'float-left')

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec risus leo. Vestibulum condimentum orci in urna auctor aliquet. Quisque mi erat, placerat non porttitor ut, gravida eu erat. Fusce semper ipsum vel nibh porttitor aliquam. Cras sed porttitor est, id scelerisque odio. Pellentesque sit amet imperdiet ex. Aliquam erat.
```

##==##

# Content with float-left

## Second way

<img class="float-left" src="./assets/images/gde.png">

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec risus leo. Vestibulum condimentum orci in urna auctor aliquet. Quisque mi erat, placerat non porttitor ut, gravida eu erat. Fusce semper ipsum vel nibh porttitor aliquam. Cras sed porttitor est, id scelerisque odio. Pellentesque sit amet imperdiet ex. Aliquam erat.

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
<img class="float-left" src="./assets/images/gde.png">

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec risus leo. Vestibulum condimentum orci in urna auctor aliquet. Quisque mi erat, placerat non porttitor ut, gravida eu erat. Fusce semper ipsum vel nibh porttitor aliquam. Cras sed porttitor est, id scelerisque odio. Pellentesque sit amet imperdiet ex. Aliquam erat.
```

##==##

# Content with float-right

## First way

![](./assets/images/gde.png 'float-right')

[Source of the image](http://www.sfeir.com)

<!-- .element: class="credits" -->

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec risus leo. Vestibulum condimentum orci in urna auctor aliquet. Quisque mi erat, placerat non porttitor ut, gravida eu erat. Fusce semper ipsum vel nibh porttitor aliquam. Cras sed porttitor est, id scelerisque odio. Pellentesque sit amet imperdiet ex. Aliquam erat.

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
![](./assets/images/gde.png 'float-right')

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec risus leo. Vestibulum condimentum orci in urna auctor aliquet. Quisque mi erat, placerat non porttitor ut, gravida eu erat. Fusce semper ipsum vel nibh porttitor aliquam. Cras sed porttitor est, id scelerisque odio. Pellentesque sit amet imperdiet ex. Aliquam erat.
```

##==##

# Content with float-right

## Second way

<img class="float-right" src="./assets/images/gde.png">

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec risus leo. Vestibulum condimentum orci in urna auctor aliquet. Quisque mi erat, placerat non porttitor ut, gravida eu erat. Fusce semper ipsum vel nibh porttitor aliquam. Cras sed porttitor est, id scelerisque odio. Pellentesque sit amet imperdiet ex. Aliquam erat.

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
<img class="float-right" src="./assets/images/gde.png">

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec risus leo. Vestibulum condimentum orci in urna auctor aliquet. Quisque mi erat, placerat non porttitor ut, gravida eu erat. Fusce semper ipsum vel nibh porttitor aliquam. Cras sed porttitor est, id scelerisque odio. Pellentesque sit amet imperdiet ex. Aliquam erat.
```

##==##

<!-- .slide: class="full-center" -->

# Image with source

![](./assets/images/GDG-Logo-carre.png)

[Source of the image](http://www.sfeir.com)

<!-- .element: class="credits" -->

##==##

## Use Feathers icons

Using markdown image

![](github 'tc-icons feather') basic icon

![](github 'tc-icons feather tc-small') small icon

![](github 'tc-icons feather tc-big') big icon

![](github 'tc-icons feather')<!-- .element: style="--tc-icon-size:96px; --tc-icon-color:orange;" --> custom icon and custom color

Using html

<i data-feather="github" ></i> basic icon

Complete list of icons : https://feathericons.com/

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
## Use Feathers icons

Using markdown image
![](github 'tc-icons feather') basic icon

![](github 'tc-icons feather tc-small') small icon

![](github 'tc-icons feather tc-big') big icon

![](github 'tc-icons feather')<!-- .element: style="--tc-icon-size:96px; --tc-icon-color:orange;" --> custom icon and custom color
Using html
<i data-feather="github" ></i> basic icon
```

##==##

# Admonition Blocks

Du texte Admonition en mode informatif mais qui est vraiment assez long et qui du coup nécessite un retour à la ligne

<!-- .element: class="admonition info" -->

<div style="display:grid;grid-template-columns: 1fr 1fr 1fr 1fr ;">
    <div>
        <p class="admonition abstract">Mode abstract</p>
        <p class="admonition tip">Mode tip</p>
        <p class="admonition note">Mode note</p>
        <p class="admonition success">Mode success</p>
    </div>
    <div>
        <p class="admonition question">Mode question</p>
        <p class="admonition warning">Mode warning</p>
        <p class="admonition failure">Mode failure</p>
        <p class="admonition danger">Mode danger</p>
    </div>
    <div>
        <p class="admonition important">Mode important</p>
        <p class="admonition bug">Mode bug</p>
        <p class="admonition example">Mode example</p>
        <p class="admonition quote">Mode quote</p>
    </div>
    <div>
        <p class="admonition custom" data-admonition-icon="🐼 Custom">Mode custom</p>
        <p class="admonition custom" data-admonition-icon="🕶️ Custombis" style="--admonition-bg-color:#d7be00;">Mode custom and custom color</p>
    </div>
</div>

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
# Admonition Blocks

Du texte Admonition en mode informatif mais qui est vraiment assez long et qui du coup nécessite un retour à la ligne

<!-- .element: class="admonition info" -->

Mode abstract

<!-- .element: class="admonition abstract" -->

Mode tip

<!-- .element: class="admonition tip" -->

Mode note

<!-- .element: class="admonition note" -->

Mode success

<!-- .element: class="admonition success" -->

Mode question

<!-- .element: class="admonition question" -->

Mode warning

<!-- .element: class="admonition warning" -->

Mode failure

<!-- .element: class="admonition failure" -->

Mode danger

<!-- .element: class="admonition danger" -->

Mode important

<!-- .element: class="admonition important" -->

Mode bug

<!-- .element: class="admonition bug" -->

Mode example

<!-- .element: class="admonition example" -->

Mode quote

<!-- .element: class="admonition quote" -->

Mode custom

<!-- .element: class="admonition custom" data-admonition-icon="🐼 Custom" -->

Mode custom and custom color

<!-- .element: class="admonition custom" data-admonition-icon="🕶️ Custombis" style="--admonition-bg-color:#d7be00;" -->
```
