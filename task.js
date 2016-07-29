'use strict';

/* ============================================================ *\
	SCRIPTS JS / lint, concat and minify scripts
\* ============================================================ */

// Gulp dependencies
var concat     = require('gulp-concat');
var gulpif = require('gulp-if')
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');

// Module dependencies
var jshint = require('gulp-jshint');
var jsdoc = require('gulp-jsdoc3');
var stylish = require('jshint-stylish');
var uglify   = require('gulp-uglify');

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

	Object.keys(taskConfig.files).forEach(function(key) {

		var bundleTaskName = TASK_NAME + ':bundle:' + key;
		var lintTaskName = TASK_NAME + ':lint:' + key;
		var docTaskName = TASK_NAME + ':docs:' + key;

		gulp.task(bundleTaskName, function() {
			return gulp.src(taskConfig.files[key])
				.pipe(gulpif(!projectConfig.isProd, sourcemaps.init())) // Default only
				.pipe(concat(key + '.js'))
				.pipe(gulpif(projectConfig.isProd, uglify())) // Production only
				.pipe(gulpif(!projectConfig.isProd, sourcemaps.write('.'))) // Default only
				.pipe(gulp.dest(projectConfig.paths.dest[TASK_NAME]));
		})
	// var generateContentsTaskName = TASK_NAME + ':generate-contents:' + key;
	// var sassCompileTaskName = TASK_NAME + ':' + key;
	//
	// gulp.task(generateContentsTaskName, function () {
	// 	return gulp.src(taskConfig.files[key].partials)
	// 		.pipe(sgc(taskConfig.files[key].src, projectConfig.creds))
	// 		.pipe(gulp.dest(projectConfig.paths.src[TASK_NAME]));
	// });
	//
	// gulp.task(sassCompileTaskName, [generateContentsTaskName], function () {
	// 	return gulp.src(taskConfig.files[key].src)
	// 		.pipe(gulpif(!projectConfig.isProd, sourcemaps.init())) //Default only
	// 		.pipe(sass({
	// 			errLogToConsole: true,
	// 			includePaths:    [projectConfig.paths.src.components],
	// 			outputStyle:     'compact'
	// 		}))
	// 		.pipe(postcss(getPostCssPlugins(taskConfig.files[key].config)))
	// 		.pipe(gulpif(!projectConfig.isProd, sourcemaps.write('.'))) //Default only
	// 		.pipe(gulp.dest(projectConfig.paths.dest[TASK_NAME]));
	// });
	//
	// sassTasksArr.push(sassCompileTaskName);
	});

	gulp.task(TASK_NAME + ':bundle', function () {
		return gulp.src(taskConfig.src)
			.pipe(gulpif(!projectConfig.isProd, sourcemaps.init())) // Default only
			.pipe(concat(taskConfig.bundle))
			.pipe(gulpif(projectConfig.isProd, uglify())) // Production only
			.pipe(gulpif(!projectConfig.isProd, sourcemaps.write('.'))) // Default only
			.pipe(gulp.dest(projectConfig.paths.dest[TASK_NAME]));
	});

	gulp.task(TASK_NAME + ':lint', function () {
		return gulp.src(taskConfig.src)
			.pipe(gulpif(!projectConfig.isProd, jshint(taskConfig.jshint))) // Default only
			.pipe(gulpif(!projectConfig.isProd, jshint.reporter(stylish))) // Default only
	});

	gulp.task(TASK_NAME + ':docs', function () {
		return gulp.src(taskConfig.src)
			.pipe(gulpif(!projectConfig.isProd, jsdoc(taskConfig.docs))); // Default only
	});

	gulp.task(TASK_NAME, [TASK_NAME + ':lint', TASK_NAME + ':bundle', TASK_NAME + ':docs']);

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
