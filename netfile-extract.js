var zip = require('node-zip');

var xlsxToRowSheets = require('xlsx-to-row-sheets');


function netfileExtract(zipBuffer, cb) {
	var xlsxBuffer = getFirstFileFromZip(zipBuffer);

	xlsxToRowSheets(xlsxBuffer, function(err, sheets) {
		cb(err, sheets);
	});
}


function getFirstFileFromZip(zipBuffer) {
	var archive = zip(zipBuffer, {base64: false, checkCRC32: true});

	var firstFilename = Object.keys(archive.files)[0];

	var file = archive.files[firstFilename];

	return file.asNodeBuffer();
}


module.exports = netfileExtract;
