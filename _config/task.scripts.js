/* jshint node: true */

'use strict';

function getTaskConfig(projectConfig) {
	var taskConfig = {
		jshint: {

		},
		src:          projectConfig.paths.src.base + '**/*.js',
		watch:        [
			projectConfig.paths.src.components + '**/*.js'
		]
	};

	return taskConfig;
}

module.exports = getTaskConfig;
