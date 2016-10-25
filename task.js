'use strict';

/* ============================================================ *\
	SCRIPTS JS / lint, concat and minify scripts
\* ============================================================ */

// Gulp dependencies
var concat     = require('gulp-concat');
var gulpif = require('gulp-if')
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var babel = require("gulp-babel");

// Module dependencies
var jshint = require('gulp-jshint');
var jsdoc = require('gulp-jsdoc3');
var stylish = require('jshint-stylish');
var uglify   = require('gulp-uglify');
var scantree = require('scantree');
var globArray = require('glob-array');

var helpers = require('./helpers');

function getJsConfigFromScantree(directory) {
	var i;
	var excludes = [
		/^(.+\.json)|(.+\.scss)|(.+\.hbs)|(.+\.txt)$/g,
		/picturefill/i,
		/lazysizes/i,
		/.DS_STORE/i
	];

	var files = globArray.sync(directory);

	var response = JSON.parse(scantree.scan({
		files: files,
		base_dir:   process.cwd(),
		groups:     false,
		recursive:  true,
		full_paths: true,
		excludes:   excludes,
		ignore: {
			invalid: false,
			missing: false
		}
	}));

	return response;
}

module.exports = function(gulp, projectConfig, tasks) {

	/* --------------------
	*	CONFIGURATION
	* ---------------------*/

	var TASK_NAME = 'scripts';

	// Task Config
	var taskConfig = require(path.resolve(process.cwd(), projectConfig.dirs.config, 'task.' + TASK_NAME + '.js'))(projectConfig);

	var scriptTasks = [];

	/* --------------------
	*	MODULE TASKS
	* ---------------------*/

	if(taskConfig.useBabel) {
		helpers.symlinkBabelDirectories();
	}

	Object.keys(taskConfig.files).forEach(function generateTasks(key) {

		var bundleTaskName = TASK_NAME + ':bundle:' + key;
		var lintTaskName = TASK_NAME + ':lint:' + key;
		var docTaskName = TASK_NAME + ':docs:' + key;

		var generateDocsConfig = taskConfig.files[key].generateDocs
		var includeDocsTask = (typeof generateDocsConfig !== 'undefined') ? generateDocsConfig : true;

		var lintFilesConfig = taskConfig.files[key].lintFiles;
		var includeLintTask = (typeof lintFilesConfig !== 'undefined') ? lintFilesConfig : true;
		var srcFiles = (taskConfig.useScantree) ? getJsConfigFromScantree(taskConfig.files[key].src) : taskConfig.files[key].src;

		gulp.task(bundleTaskName, function() {
			return gulp.src(srcFiles)
				.pipe(gulpif(!projectConfig.isProd, sourcemaps.init())) // Default only
				.pipe(gulpif(taskConfig.useBabel, babel()))
				.pipe(concat(key + '.js'))
				.pipe(gulpif(projectConfig.isProd, uglify())) // Production only
				.pipe(gulpif(!projectConfig.isProd, sourcemaps.write('.'))) // Default only
				.pipe(gulp.dest(projectConfig.paths.dest[TASK_NAME]));
		})

		scriptTasks.push(bundleTaskName);

		if(includeLintTask) {
			gulp.task(lintTaskName, function() {
				return gulp.src(srcFiles)
					.pipe(gulpif(!projectConfig.isProd, jshint(taskConfig.jshint))) // Default only
					.pipe(gulpif(!projectConfig.isProd, jshint.reporter(stylish))) // Default only
			})

			scriptTasks.push(lintTaskName);
		}

		if(includeDocsTask) {
			gulp.task(docTaskName, function() {
				return gulp.src(srcFiles)
					.pipe(gulpif(!projectConfig.isProd, jsdoc(taskConfig.docs))); // Default only
			})

			scriptTasks.push(docTaskName);
		}

	});

	gulp.task(TASK_NAME, scriptTasks);

	/* --------------------
	*	WATCH TASKS
	* ---------------------*/

	gulp.task('watch:' + TASK_NAME, function () {
		gulp.watch(
			taskConfig.watch,
			[TASK_NAME]
		);
	});

	/* ----------------------------
	*	CARTRIDGE TASK MANAGEMENT
	* -----------------------------*/

	// Add the clean path for the generated scripts
	projectConfig.cleanPaths.push(projectConfig.paths.dest[TASK_NAME]);
	// Add the task to the default list
	tasks.default.push(TASK_NAME);
	// Add the task to the watch list
	tasks.watch.push('watch:' + TASK_NAME);
}
