var path = require('path');
var fs = require('fs-extra');
var scantree = require('scantree');
var globArray = require('glob-array');

var helpersApi = {};

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

helpersApi.symlinkBabelDirectories = function() {
	var projectPath = path.resolve('node_modules', 'babel-preset-es2015');
	var modulePath = path.resolve(__dirname, 'node_modules/babel-preset-es2015');

	fs.ensureSymlinkSync(modulePath, projectPath, 'dir');
}

helpersApi.getSrcFiles = function(srcFiles, usingBabel) {
	if(usingBabel) {
		return getJsConfigFromScantree(srcFiles);
	} else {
		return srcFiles;
	}
}

module.exports = helpersApi;
