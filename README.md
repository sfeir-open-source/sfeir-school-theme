# Sfeir School Theme

This repository is an Open Source theme for RevealJS presentations. It respect the graphical theme of [@Sfeir](https://github.com/sfeir) company.

# How to use it:

## Npm (come later not activ yet)

```sh
# run
$npm install sfeir-theme
```

## Cloning the repo

Let's consider that the path to reveal engine is at `$REVEAL_PATH`

1. Clone the repository in your project (`$SFEIR_THEME_PATH`)
2. In your reveal index.html add the following lines:
```html

...
<head>
    ...
    <!-- For syntax highlighting : Use Tomorrow.css -->
    <link rel="stylesheet" href="$REAVEAL_PATH/highlight.js/src/styles/tomorrow.css">

    ...
    <!-- Sfeir Theme includes -->
    <link rel="stylesheet" href="$SFEIR_THEME_PATH/dist/css/sfeir-school-theme.css" id="theme">
    <script type="module" src="$SFEIR_THEME_PATH/dist/js/sfeir-theme.js"></script>
</head>
...

```

Enjoy!


# Features

* Specifics slides management: 
  * First Slide
  * Speaker Slide
  * Transitions Slides
  * Multiples backgrounds
* Code Higlighting (sequential highlighting will come after)
  * Choice of Dark code or Light code
  * Choice of font
* Two columns layout
* Somes helpers for images
* Easyer management of restitution slides.
* Expose some custom properties corresponding to the theme.
* As it's controlled by class, it's compatible with markdown syntax or html

## Specifics Slides: 

### First slide

```md
<!-- .slide: class="first-slide" sfeir-level="1" sfeir-techno="pwa" -->

# **Welcome to Sfeir School**
## **PWA 100**
```

* Attribute: `sfeir-level` could change from 1 to 3
* Attribute: `sfeir-techno` display the technology of the sfeir school in the badge of sfeir school.

For the class, you can alseo add class `first-pink`or `first-red` to use the pink background or red background.

### Sfeir School presentation Slide

```md
<!-- .slide: class="school-presentation" -->

<div class="wifi">
    <span class="key">wifi:</span><span>SSID</span><br>
    <span class="key">mdp:</span><span>PASSWORD</span>
</div>
```

### Speaker Slide

```md
<!-- .slide: class="speaker-slide" -->

# Présentation

![speaker](./assets/images/jf.jpg)
![company](./assets/images/logo_sfeir_bleu_orange.png)
![badge](./assets/images/gde.png)

## Jean-François Garreau

### CTO front

### @jefbinomed
```

### Transitions slides

```md
<!-- .slide: class="transition" -->

# Management of custom slides
```

You can use those class for transitions slides : 
* `transition`: will position the title in the bottom of the slide
* `transition-white`: the text will be in white
* `transition-center`: the text will be center vertically
* `sfeir-bg-red` / `sfeir-bg-pink` / `sfeir-bg-blue` / `sfeir-bg-white-4` : use the dedicate slide.

### Two column layout

```md
<!-- .slide: class="two-column-layout"-->

# A Title

##--##

content left

##--##

content right
```


### Slides with code

```md

<!-- .slide: class="with-code" -->

## Some Code (with monospace font)


` ` `xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent"
    >
    <TextView
        android:layout_width="fill_parent"
        android:layout_height="wrap_content"
        android:text="@string/hello"
        />
</LinearLayout>
` ` `
```

You can also use class: 
* `with-code-dark`: to use a dark theme (default is light theme)
* `consolas`: will use consolas font
* `inconsolata`: will use inconsolata font
* `big-code`: will use a big size of font

# Contribute

Use Node 10 as node version

1. run `nvm use` if you have nvm installed
2. run `npm install`
3. run `npm start`

## Errors

If you got a "System limit for number of file watchers reached" error , take a look at this solution : [StackOverFlow Watching Error](https://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc/17437601#17437601)

