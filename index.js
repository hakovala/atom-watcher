"use strict";
/* global document */

var fs = require('fs');
var path = require('path');
var url = require('url');

var reload_delay = 1000;
var watchers = [];

module.exports = function(opt) {
	opt = opt || {};

	if (typeof opt.reload_delay !== 'undefined') {
		reload_delay = opt.reload_delay;
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

var reload_timeout;
function reloadDelayed() {
	if (reload_timeout) {
		clearTimeout(reload_timeout);
	}
	reload_timeout = setTimeout(function() {
		document.location.reload();
	}, reload_delay);
}

function watchStyles() {
	var styles = document.querySelectorAll('link[rel=stylesheet]');

	function watch(style) {
		console.log('watch: ' + style.href);
		var uri = url.parse(style.href, true);
		var w = fs.watch(uri.pathname, {
			persistent: false
		}, function(e, filename) {
			console.log(e + ': ' + filename);
			uri.query = {
				time: new Date().getTime()
			};
			style.href = url.format(uri);
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
		reloadDelayed();
	});
	watchers.push(w);
}

function watchHTML() {
	watchFile(document.location.pathname);
}

function watchScripts() {
	var scripts = document.querySelectorAll('script');

	for (var i = 0; i < scripts.length; i++) {
		var uri = url.parse(scripts[i].src);
		watchFile(uri.pathname);
	}

	for (var filepath in require.cache) {
		watchFile(filepath);
	}
}

