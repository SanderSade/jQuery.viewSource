# viewSource jQuery plugin

![screenshot](http://dukelupus.com/images/jQuery.viewSource.png)

## Purpose
Show the source of the current web page or a part of it in its current state. Useful in HTML/JS/CSS demonstration pages, allowing users to easily see your HTML source.

Optional support for the google-code-prettify (http://code.google.com/p/google-code-prettify/) script - you must include prettify.css and prettify.js to your web page.

Includes HTMLEncode (Copyright (c) 2006-2010 Thomas Peri, http://www.tumuski.com/) 

## Use
Include the script to your web page: `<script type="text/javascript" src="jQuery.viewSource.min.js"></script>`. See the [included example](https://github.com/SanderSade/jQuery.viewSource/tree/master/example).

Two methods:
1. Add $(someselector).viewSource(code-to-show-selector); to document.ready. This will bind onclick event to the element(s) specified by your selector - i.e. clicking on those elements will show the source.
2. Call $().showSource(code-to-show-selector); yourself to immediately show the source.

Note: "code-to-show-selector" is optional selector for the element which code to show. If left empty or passed an empty string, it will default to "html", ie. whole page.
