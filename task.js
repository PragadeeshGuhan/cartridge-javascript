'use strict';

/* ============================================================ *\
	SCRIPTS JS / lint, concat and minify scripts
\* ============================================================ */

// Gulp dependencies
var gulpif     = require('gulp-if')
var path = require('path');

// Module dependencies
var jshint   = require('gulp-jshint');
var stylish  = require('jshint-stylish');

module.exports = function(gulp, projectConfig, tasks) {

	/* --------------------
	*	CONFIGURATION
	* ---------------------*/

	var TASK_NAME = 'scripts';

	// Task Config
	var taskConfig = require(path.resolve(process.cwd(), projectConfig.dirs.config, 'task.' + TASK_NAME + '.js'))(projectConfig);

	/* --------------------
	*	MODULE TASKS
	* ---------------------*/

	gulp.task(TASK_NAME + ':lint', function () {
		return gulp.src(taskConfig.src)
			.pipe(gulpif(!argv.prod, jshint(jshintConfig))) //Default only
			.pipe(gulpif(!argv.prod, jshint.reporter(stylish))); //Default only
			.pipe(gulp.dest(projectConfig.paths.dest[TASK_NAME]));
	});

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
