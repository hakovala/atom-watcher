"use strict";
/* global document */

var fs = require('fs');
var path = require('path');
var url = require('url');
var rtimer = require('rtimer');

var reload_delay = 500;
var watchers = [];

// timeout for reloading whole page
var reloadTimeout = rtimer(function() {
	document.location.reload();
}, reload_delay);

module.exports = function(opt) {
	opt = opt || {};

	if (typeof opt.reload_delay !== 'undefined') {
		reload_delay = opt.reload_delay;
		reloadTimeout.delay = reload_delay;
	}
	if (typeof opt.html === 'undefined' || opt.html) {
		watchHTML();
	}
	if (typeof opt.style === 'undefined' || opt.style) {
		watchStyles();
	}
	if (typeof opt.script === 'undefined' || opt.script) {
		watchScripts();
	}
};

function watchStyles() {
	var styles = document.querySelectorAll('link[rel=stylesheet]');

	function watch(style) {
		console.log('watch: ' + style.href);
		var uri = url.parse(style.href, true);
		var w = fs.watch(uri.pathname, {
			persistent: false
		}, function(e, filename) {
			console.log(e + ': ' + filename);
			// delay the style reload (fixes issues when building stylesheets)
			setTimeout(function() {
				uri.query = {
					time: new Date().getTime()
				};
				style.href = url.format(uri);

				// force re-flow the page
				var dummy = document.body.offsetTop;
			}, reload_delay);
		});
		watchers.push(watchers);
	}

	for (var i = 0; i < styles.length; i++) {
		watch(styles[i]);
	}
}

function watchFile(filepath) {
	var w = fs.watch(filepath, {
		persistent: false
	}, function(e, filename) {
		console.log(e + ': ' + filename);
		reloadTimeout.set();
	});
	watchers.push(w);
}

function watchHTML() {
	watchFile(document.location.pathname);
}

function watchScripts() {
	var scripts = document.querySelectorAll('script');

	for (var i = 0; i < scripts.length; i++) {
		if (scripts[i].src) {
			var uri = url.parse(scripts[i].src);
			watchScript(uri.pathname);
		}
	}

	for (var filepath in require.cache) {
		watchScript(filepath);
	}
}

var splitCache = {};
function watchScript(filepath) {
	if (~filepath.indexOf('.asar')) {
		filepath = filepath.split('.asar')[0] + '.asar';
	}
	if (!splitCache[filepath]) {
		splitCache[filepath] = true;
		watchFile(filepath);
	}
}
