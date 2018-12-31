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

TBD...


# Contribute

Use Node 10 as node version

1. run `nvm use` if you have nvm installed
2. run `npm install`
3. run `npm start`

## Errors

If you got a "System limit for number of file watchers reached" error , take a look at this solution : [StackOverFlow Watching Error](https://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc/17437601#17437601)

TBD...