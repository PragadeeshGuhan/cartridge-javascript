'use strict';

function getTaskConfig(projectConfig) {
	var taskConfig = {
		jshint: {
			"bitwise"       : true,
			"camelcase"     : true,
			"curly"         : true,
			"eqeqeq"        : true,
			"indent"        : 4,
			"newcap"        : true,
			"noarg"         : true,
			"noempty"       : true,
			"plusplus"      : false,
			"quotmark"      : "single",
			"regexp"        : true,
			"undef"         : true,
			"unused"        : true,
			"strict"        : true,
			"trailing"      : true,
			"maxparams"     : 20,
			"maxdepth"      : 3,
			"maxstatements" : 50,
			"maxcomplexity" : 10,
			"asi"           : false,
			"boss"          : false,
			"debug"         : false,
			"eqnull"        : false,
			"es5"           : false,
			"esnext"        : false,
			"evil"          : false,
			"expr"          : false,
			"funcscope"     : false,
			"globalstrict"  : false,
			"iterator"      : false,
			"lastsemic"     : false,
			"laxbreak"      : false,
			"laxcomma"      : false,
			"loopfunc"      : false,
			"multistr"      : false,
			"onecase"       : false,
			"proto"         : false,
			"regexdash"     : false,
			"scripturl"     : false,
			"smarttabs"     : true,
			"shadow"        : false,
			"sub"           : false,
			"supernew"      : false,
			"validthis"     : false,
			"nomen"         : false,
			"onevar"        : false,
			"passfail"      : false,
			"white"         : false,
			"globals": {
				"$": true,
				"clearInterval": true,
				"clearTimeout": true,
				"console": true,
				"document": true,
				"jQuery": true,
				"ga": true,
				"Modernizr": true,
				"module": true,
				"node": true,
				"process": true,
				"require": true,
				"setInterval": true,
				"setTimeout": true,
				"window": true,
				"XMLHttpRequest": true
			}
		},
		src: projectConfig.paths.src.base + '**/*.js',
		docs: projectConfig.paths.src.base + 'docs/jsdocs',
		watch: [
			projectConfig.paths.src.components + '**/*.js'
		]
	};

	return taskConfig;
}

module.exports = getTaskConfig;
