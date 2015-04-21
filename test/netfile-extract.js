var netfileExtract = require('../netfile-extract');

var assert = require('assert');

var fs = require('fs');


var FILE_CONTENTS = fs.readFileSync(__dirname + '/files/2015_WESTSAC.zip');


describe('netfileExtract', function() {
	var sheets;

	it('should extract sheets from a file without errors', function(done) {
		netfileExtract(FILE_CONTENTS, function(err, results) {
			if(err) return done(err);

			sheets = results;

			done();
		});
	});

	it('should have the correct format', function() {
		assert.equal(typeof sheets, 'object');

		assert(Array.isArray(sheets['497']));

		assert(Array.isArray(sheets['497'][0]));

		assert.equal(typeof sheets['497'][0][0], 'string');
	});

	it('should have the correct content', function() {
		var sheet = sheets['497'];

		var row = sheet[0];

		assert.equal(row[0], 'Filer_ID');
	});
});