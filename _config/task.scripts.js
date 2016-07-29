'use strict';

function getTaskConfig(projectConfig) {
	var taskConfig = {
		files: {
			bundle: [
				projectConfig.paths.src.scripts + '**/*.js',
				projectConfig.paths.src.components + '**/*.js'
			],
			file2: [],
			file3: []
		},
		docs: {
		  "opts": {
			"destination": "./docs/gen"
		  }
		},
		jshint: {},
		watch: [
			projectConfig.paths.src.scripts + '**/*.js'
		]
	};

	return taskConfig;
}

module.exports = getTaskConfig;
