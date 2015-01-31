# Atom Watcher

Watch html, js and css files in Atom-Shell application for any changes.
Reloads the page if html or js files change, and live reloads css files when
they change.

## Install

	npm install atom-watcher

## Usage

With default options:

	require('atom-watcher')();

With options:

	require('atom-watcher')({
		reload_delay: 500, // wait 500ms before reloading
		html: false, // disable reload on html change
		css: false, // disable style updates
		script: false, // disable reload on script change
	});

After that if any html or script file change, the page is reloaded.
If styles change only that css file is reloaded.

Atom Watcher automatically watches all script files that are used with
require or defined in html page.
CSS files are extracted from browser document and live-reloaded.
