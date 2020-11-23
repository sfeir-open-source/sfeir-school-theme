
<!-- .slide: class="transition" -->

# Slides using helpers of theme


##==##

# Slide with center image (horizontal)

## First way

![center](./assets/images/GDG-Logo-carre.png)

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
![center](./assets/images/GDG-Logo-carre.png)
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

![h-200](./assets/images/GDG-Logo-carre.png)
![h-250](./assets/images/GDG-Logo-carre.png)
![h-300](./assets/images/GDG-Logo-carre.png)
![h-200](./assets/images/GDG-Logo-carre.png)
![h-350](./assets/images/GDG-Logo-carre.png)
![h-300](./assets/images/GDG-Logo-carre.png)
![h-350](./assets/images/GDG-Logo-carre.png)
![h-200](./assets/images/GDG-Logo-carre.png)
![h-100](./assets/images/GDG-Logo-carre.png)


##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
<!-- .slide: class="flex-row" -->

![h-200](./assets/images/GDG-Logo-carre.png)
![h-250](./assets/images/GDG-Logo-carre.png)
![h-300](./assets/images/GDG-Logo-carre.png)
![h-200](./assets/images/GDG-Logo-carre.png)
![h-350](./assets/images/GDG-Logo-carre.png)
![h-300](./assets/images/GDG-Logo-carre.png)
![h-350](./assets/images/GDG-Logo-carre.png)
![h-200](./assets/images/GDG-Logo-carre.png)
![h-100](./assets/images/GDG-Logo-carre.png)
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

![w-500](./assets/images/350x90.png)


Div background: 

<div style="background:red;" class="w-500 h-200"> w-500 h-200</div>


##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown

![w-500](./assets/images/350x90.png)

<div style="background:red;" class="w-500 h-200"> w-500 h-200</div>
```
<!-- .element: class="big-code" -->

##==##

# Play with images max-sizes

## Image from 50px to 1000px (max-width and max-height)

Image : 

![wm-500](./assets/images/350x90.png)


Div background: 

<div style="background:red; width:600px;" class="wm-500 h-200"> (height:600px) wm-500 h-200</div>

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
![wm-500](./assets/images/350x90.png)

<div style="background:red; width:600px;" class="wm-500 h-200"> 
    (height:600px) wm-500 h-200</div>
```
<!-- .element: class="big-code" -->


##==##

<!-- .slide: class="flex-row" -->

# Play with margin top or bottom

<br><br>

![h-200 mt-430](./assets/images/GDG-Logo-carre.png)
![h-200 mt-150](./assets/images/GDG-Logo-carre.png)
![h-200 mt-50](./assets/images/GDG-Logo-carre.png)
![h-200 mt-10](./assets/images/GDG-Logo-carre.png)
![h-200](./assets/images/GDG-Logo-carre.png)
![h-200 mb-10](./assets/images/GDG-Logo-carre.png)
![h-200 mb-50](./assets/images/GDG-Logo-carre.png)
![h-200 mb-160](./assets/images/GDG-Logo-carre.png)
![h-200 mb-430](./assets/images/GDG-Logo-carre.png)


##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
<!-- .slide: class="flex-row" -->

![h-200 mt-430](./assets/images/GDG-Logo-carre.png)
![h-200 mt-150](./assets/images/GDG-Logo-carre.png)
![h-200 mt-50](./assets/images/GDG-Logo-carre.png)
![h-200 mt-10](./assets/images/GDG-Logo-carre.png)
![h-200](./assets/images/GDG-Logo-carre.png)
![h-200 mb-10](./assets/images/GDG-Logo-carre.png)
![h-200 mb-50](./assets/images/GDG-Logo-carre.png)
![h-200 mb-160](./assets/images/GDG-Logo-carre.png)
![h-200 mb-430](./assets/images/GDG-Logo-carre.png)
```


##==##

# Image with full width

## First way


![full-width](./assets/images/Sfeir-Gris-vector.svg)

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
![full-width](./assets/images/Sfeir-Gris-vector.svg)
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

![float-left](./assets/images/gde.png)

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec risus leo. Vestibulum condimentum orci in urna auctor aliquet. Quisque mi erat, placerat non porttitor ut, gravida eu erat. Fusce semper ipsum vel nibh porttitor aliquam. Cras sed porttitor est, id scelerisque odio. Pellentesque sit amet imperdiet ex. Aliquam erat.


##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
![float-left](./assets/images/gde.png)

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

![float-right](./assets/images/gde.png)

[Source of the image](http://www.sfeir.com)
<!-- .element: class="credits" -->

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec risus leo. Vestibulum condimentum orci in urna auctor aliquet. Quisque mi erat, placerat non porttitor ut, gravida eu erat. Fusce semper ipsum vel nibh porttitor aliquam. Cras sed porttitor est, id scelerisque odio. Pellentesque sit amet imperdiet ex. Aliquam erat.


##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```markdown
![float-right](./assets/images/gde.png)

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

<!-- .slide: data-type-show="full" -->

## A slide for publication only

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec risus leo. Vestibulum condimentum orci in urna auctor aliquet. Quisque mi erat, placerat non porttitor ut, gravida eu erat. Fusce semper ipsum vel nibh porttitor aliquam. Cras sed porttitor est, id scelerisque odio. Pellentesque sit amet imperdiet ex. Aliquam erat.
