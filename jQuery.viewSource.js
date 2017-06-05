/*
*** viewSource jQuery plugin ***
Copyright (c) 2013 Sander Säde (http://dukelupus.com)
Licensed under MPL version 1.1 - http://www.mozilla.org/MPL/MPL-1.1.txt

*** Purpose ***
Show the source of the current web page or a part of it in its current state. Useful in HTML/JS/CSS demonstration pages, allowing users to easily see your HTML source.

Optional support for the google-code-prettify (http://code.google.com/p/google-code-prettify/) script - you must include prettify.css and prettify.js to your web page.

Includes HTMLEncode (Copyright (c) 2006-2010 Thomas Peri, http://www.tumuski.com/) 

*** Use ***
Include the script to your web page:  <script type="text/javascript" src="jQuery.viewSource.min.js"></script>

Two methods:
1. Add $(someselector).viewSource(code-to-show-selector); to document.ready. This will bind onclick event to the element(s) specified by your selector - i.e. clicking on those elements will show the source.
2. Call $().showSource(code-to-show-selector); yourself to immediately show the source.

Note: "code-to-show-selector" is optional selector for the element which code to show. If left empty or passed an empty string, it will default to "html", ie. whole page.
*/


// Bind click event to whatever we've given

(function ($) {
	jQuery.fn.viewSource = function (selector) {
		return this.each(function () {
			$(this).on("click", function () { $.fn.showSource(selector); });
		});
	};
	jQuery.fn.showSource = function (selector) {

		if (selector == undefined || selector == "")
			selector = "html";
		var currentSource = $(selector).html(); //let's get the source before we meddle with it       

		var display = "<div id='viewSource_display'><div id='viewSource_bglayer' style='background: none repeat scroll 0 0 Gray;height: 100%;left: 0;opacity: 0.95;position: fixed;text-align: center;top: 0;width: 100%;z-index: 50;'></div><div id='viewSource_holder' style='background: none repeat scroll 0 0 white;border: 1px solid #D2D2D2;display: block;bottom:1%;left:10%; right:10%;margin-left: auto;margin-right: auto;position: fixed;top: 1%;z-index: 100;'><div id='viewSource_header' style='background-color: #EAEAEA;border-bottom: 1px solid #D2D2D2;padding: 1px;text-align: right;height: 15px;display:block;font-family:Verdana;font-size:8pt;'><span style='text-shadow: Gray 1px 1px 1px;float:left;'>Source</span>&nbsp;&nbsp;<span id='viewSource_close' style='color:red;cursor:pointer;font-weight: bold;font-size:10pt'>x&nbsp;</span></div><div id='viewSource_content' style='height:96.5%; overflow-y:scroll;overflow-x:auto; text-align:left;margin: 5px;'>&nbsp;</div></div></div>";
		//append our elements and source
		$("body").append(display);
		$("#viewSource_content").html("<pre class='prettyprint lang-html'>" + htmlEncode(currentSource, 1, 4) + "</pre>");

		try {
			prettyPrint();
		}
		catch (e) {			
			//silent exception, if PrettyPrint script is not included
		}
	

		//fade out the source display and remove it from the page
		$("#viewSource_close").click(function () {
			$("#viewSource_display").fadeOut(400,
		function () { $("#viewSource_display").remove(); });
		});		
	};
} (jQuery));



var htmlEncode = function (source, display, tabs) {
	var i, s, ch, peek, line, result, next, endline, push, spaces;

	// Stash the next character and advance the pointer
	next = function () {
		peek = source.charAt(i);
		i += 1;
	};

	// Start a new "line" of output, to be joined later by <br />
	endline = function () {
		line = line.join('');
		if (display) {
			// If a line starts or ends with a space, it evaporates in html
			// unless it's an nbsp.
			line = line.replace(/(^ )|( $)/g, '&nbsp;');
		}
		result.push(line);
		line = [];
	};

	// Push a character or its entity onto the current line
	push = function () {
		if (ch < ' ' || ch > '~') {
			line.push('&#' + ch.charCodeAt(0) + ';');
		} else {
			line.push(ch);
		}
	};

	// Use only integer part of tabs, and default to 4
	tabs = (tabs >= 0) ? Math.floor(tabs) : 4;

	result = [];
	line = [];

	i = 0;
	next();
	while (i <= source.length) { // less than or equal, because i is always one ahead
		ch = peek;
		next();

		// HTML special chars.
		switch (ch) {
			case '<':
				line.push('&lt;');
				break;
			case '>':
				line.push('&gt;');
				break;
			case '&':
				line.push('&amp;');
				break;
			case '"':
				line.push('&quot;');
				break;
			case "'":
				line.push('&#39;');
				break;
			default:
				// If the output is intended for display,
				// then end lines on newlines, and replace tabs with spaces.
				if (display) {
					switch (ch) {
						case '\r':
							// If this \r is the beginning of a \r\n, skip over the \n part.
							if (peek === '\n') {
								next();
							}
							endline();
							break;
						case '\n':
							endline();
							break;
						case '\t':
							// expand tabs
							spaces = tabs - (line.length % tabs);
							for (s = 0; s < spaces; s += 1) {
								line.push(' ');
							}
							break;
						default:
							// All other characters can be dealt with generically.
							push();
					}
				} else {
					// If the output is not for display,
					// then none of the characters need special treatment.
					push();
				}
		}
	}
	endline();

	// If you can't beat 'em, join 'em.
	result = result.join('<br />');

	if (display) {
		// Break up contiguous blocks of spaces with non-breaking spaces
		result = result.replace(/ {2}/g, ' &nbsp;');
	}

	// tada!
	return result;
};