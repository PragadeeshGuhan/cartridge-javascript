var path = require('path');
var fs = require('fs-extra');

var helpersApi = {};

helpersApi.symlinkBabelDirectories = function(useBabel) {
	if(useBabel) {
		var projectPath = path.resolve('node_modules', 'babel-preset-es2015');
		var modulePath = path.resolve(__dirname, 'node_modules/babel-preset-es2015');

		fs.ensureSymlinkSync(modulePath, projectPath, 'dir');
	}
}

module.exports = helpersApi;
