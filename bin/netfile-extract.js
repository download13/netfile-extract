#!/usr/bin/env node

var netfileExtract = require('../netfile-extract');

var program = require('commander');

var path = require('path');

var fs = require('fs');

var concatStream = require('concat-stream-callback');

var csvStringify = require('csv-stringify');

var mapObject = require('map-object');

var async = require('async');

var mkdirp = require('mkdirp');


program
	.version(require('../package').version)
	.usage('[options] [netfile_archive.zip]')
	.option('-o, --output <directory>', 'Directory where the file for each sheet will be written, defaults to .', '.')
	.option('-f, --format <format>', 'Set output format, defaults to json', /^(json|csv)$/i, 'json')
	.parse(process.argv);


var input = process.stdin;

var format = program.format;

var outputDirectory = program.output;

mkdirp.sync(outputDirectory);

var filename = program.args[0];

if(filename) {
	input = fs.createReadStream(filename);
} else {
	filename = 'stdin';
}

// It seems like a good idea to limit the concurrent file writes to something reasonable
var fileWriteQueue = async.queue(writeFileToDirectory.bind(null, outputDirectory), 2);

// Collect the input from whatever source the user chose
concatStream(input, function(err, zipBuffer) {
	if(err) {
		return console.error('Unable get contents of ' + filename);
	}

	netfileExtract(zipBuffer, function(err, sheets) {
		if(err) throw err;

		var files = mapObject(sheets, function(sheet, sheetName) {
			return {
				name: sheetName + '.' + format,
				contents: sheet
			};
		});

		async.map(files, stringifyFileContents.bind(null, format), function(err, files) {
			if(err) throw err;

			files.forEach(function(file) {
				fileWriteQueue.push(file);
			});
		});
	});
});


// Replace the .contents property with an encoded string
function stringifyFileContents(format, file, cb) {
	if(format === 'json') {
		try {
			var contents = JSON.stringify(file.contents);
		} catch(e) {
			return cb(e);
		}

		cb(null, {
			name: file.name,
			contents: contents
		});
	} else {
		csvStringify(file.contents, function(err, csv) {
			if(err) return cb(err);

			cb(null, {
				name: file.name,
				contents: csv
			});
		});
	}
}

function writeFileToDirectory(directoryPath, file, cb) {
	fs.writeFile(path.join(directoryPath, file.name), file.contents, cb);
}
