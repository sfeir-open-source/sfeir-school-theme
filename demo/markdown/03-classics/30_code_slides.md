<!-- .slide: class="with-code-dark" -->

## Some Code

```xml
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
```

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

<!-- prettier-ignore -->
````markdown
<!-- .slide: class="with-code-dark" -->

```xml

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
```
````

##==##

<!-- .slide: class="with-code-dark max-height" -->

## Some Code with lots of code

```xml
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
    <TextView
        android:layout_width="fill_parent"
        android:layout_height="wrap_content"
        android:text="@string/hello"
        />
    <TextView
        android:layout_width="fill_parent"
        android:layout_height="wrap_content"
        android:text="@string/hello"
        />
    <TextView
        android:text="@string/hello"/>
</LinearLayout>
```

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

<!-- prettier-ignore -->
````markdown
<!-- .slide: class="with-code-dark max-height" -->

```xml
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
    <TextView
        android:layout_width="fill_parent"
        android:layout_height="wrap_content"
        android:text="@string/hello"
        />
    <TextView
        android:layout_width="fill_parent"
        android:layout_height="wrap_content"
        android:text="@string/hello"
        />
    <TextView
        android:text="@string/hello"/>
</LinearLayout>
```
````

##==##

<!-- .slide: class="with-code-dark" -->

## Some Code with line numbers

```xml []
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
```

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

<!-- prettier-ignore -->
````markdown
<!-- .slide: class="with-code-dark" -->

```xml []
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
```
````

##==##

<!-- .slide: class="with-code-bg-dark" -->

## Some black bloc code

```xml
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
```

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

<!-- prettier-ignore -->
````markdown
<!-- .slide: class="with-code-bg-dark" -->

```xml
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
```
````

##==##

<!-- .slide: class="with-code-dark" -->

## Some Code (with highlighting of individual lines)

```xml [1,7-11]
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
```

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

````markdown
<!-- .slide: class="with-code-dark" -->

```xml [1,7-11]
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
```
````

##==##

<!-- .slide: class="with-code" -->

## Some Code (with highlighting of individual lines step by step)

```xml [1|5-6|7-11]
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
```

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

````markdown
<!-- .slide: class="with-code" -->

```xml [1|5-6|7-11]

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
```
````

##==##

<!-- .slide: class="with-code big-code" -->

## Some BIG Code

```xml
<?xml version="1.0" encoding="utf-8"?>
```

##--##

<!-- .slide: class="with-code big-code" -->

# Code to produce / Markdown

````markdown
<!-- .slide: class="with-code big-code" -->

```xml
<?xml version="1.0" encoding="utf-8"?>
```
````

##==##

<!-- .slide: class="with-code big-code" -->

## Some BIG Code centered

```xml
<?xml version="1.0" encoding="utf-8"?>
```

<!-- .element: class="alone" -->

##--##

<!-- .slide: class="with-code big-code" -->

# Code to produce / Markdown

````markdown
<!-- .slide: class="with-code big-code" -->

```xml
<?xml version="1.0" encoding="utf-8"?>
```

<!-- .element: class="alone" -->
````

##==##

<!-- .slide: class="with-code" -->

# Text with inline code

<br><br>

- attribut `draggable=true` sur l'élément html.
  <br><br>
- `ondragstart` event sur l'élément draggable.
  <br><br>
- `ondrop` event dans la zone de dépot.
  <br><br>
- `ondraghover` event sur la zone de dépot.

##--##

<!-- .slide: class="with-code" -->

# Code to produce / Markdown

```Markdown
<!-- .slide: class="with-code" -->

<br><br>
- attribut `draggable=true` sur l'élément html.
<br><br>
- `ondragstart` event sur l'élément draggable.
<br><br>
- `ondrop` event dans la zone de dépot.
<br><br>
- `ondraghover` event sur la zone de dépot.
```

<!-- .element: class="big-code" -->
