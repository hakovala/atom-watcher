# Atom Watcher

Watch html, js and css files in Atom-Shell application for any changes.
Reloads the page if html or js files change, and live reloads css files when
they change.

## Install

	npm install atom-watcher

## Usage

With default options:

```js
require('atom-watcher')();
```

With options:

```js
require('atom-watcher')({
	reload_delay: 5000, // wait 5s before reloading (default 500ms) 
	html: false, // disable reload on html change (default true)
	css: false, // disable style updates (default true)
	script: false, // disable reload on script change (default true)
});
```

If any html or script file change, the page is reloaded after specified delay.
If styles change only that css file is refreshed after specified delay.

Atom Watcher automatically watches all script files that are used with
require or defined in html page.
CSS files are extracted from browser document and live-reloaded.
