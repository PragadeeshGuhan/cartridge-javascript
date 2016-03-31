var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs-extra');
var chai = require('chai');
var expect = chai.expect;

chai.use(require('chai-fs'));
chai.should();

var ROOT_DIR = process.cwd();
var MOCK_PROJECT_DIR = path.join(process.cwd(), 'test', 'mock-project');
var STYLE_SRC_DIR = path.join(MOCK_PROJECT_DIR, '_source', 'scripts');
var STYLE_DEST_DIR = path.join(MOCK_PROJECT_DIR, 'public', '_client', 'scripts');

var MAIN_JS_FILEPATH = path.join(STYLE_SRC_DIR, 'bundle.js');
var MAIN_JS_SOURCEMAP_FILEPATH = path.join(STYLE_DEST_DIR, 'bundle.js.map');

process.chdir(MOCK_PROJECT_DIR);

function cleanUp() {
	fs.remove(MAIN_JS_FILEPATH);
	fs.remove(MAIN_JS_SOURCEMAP_FILEPATH);
}

function runGulpTask(options, callback) {

    var gulp = spawn('gulp', options)

    gulp.on('close', function() {
        callback();
    });

}

describe('As a user of the cartridge-sass module', function() {

	this.timeout(10000);

	describe('when `gulp scripts` is run WITHOUT production flag', function() {

		before(function(done) {
			runGulpTask(['scripts'], done)
		})

		after(function() {
			cleanUp();
		})

		it('should generate the bundle.js file in the _source dir', function() {
			expect(MAIN_JS_FILEPATH).to.be.a.file();
		})

		it('should add the bundle.js.map sourcemap file to the public styles folder', function() {
			expect(MAIN_JS_SOURCEMAP_FILEPATH).to.be.a.file();
		})

	})

	describe('when `gulp scripts` is run WITH production flag', function() {

		before(function(done) {
			runGulpTask(['sass', '--prod'], done)
		})

		after(function() {
			cleanUp();
		})

		it('should generate the bundle.js file in the _source dir', function() {
			expect(MAIN_JS_FILEPATH).to.be.a.file();
		})

		it('should not add the bundle.js.map sourcemap file to the public styles folder', function() {
			expect(MAIN_JS_SOURCEMAP_FILEPATH).to.not.be.a.file();
		})

	})

})