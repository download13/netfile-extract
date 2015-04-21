# netfile-extract

This module takes a buffer object containing a Netfile zip export and turns it into an output object as described in the documentation for [xlsx-to-row-sheets](https://github.com/download13/xlsx-to-row-sheets).

## Install

    npm install netfile-extract

## Example

```javascript
var netfileExtract = require('netfile-extract');

netfileExtract(zipBuffer, function(err, sheets) {
	// sheets will be an object mapping sheet names to sheets
	// Each sheet is an array of rows
	// Each row is an array of strings

	/*
	{
		sheet1: [
			['id', 'somecolumn'],
			['0', 'first row']
		]
	}
	*/
});
```

## CLI

    netfile-extract -o sheets_dir -f csv 2014.zip

The `-o` option default to the current directory.

    netfile-extract -f csv 2014.zip

The output format can be CSV or JSON. It is JSON by default.

    netfile-extract 2014.zip

The script can take input from `stdin` instead of a file.

    netfile-download SAC | netfile-extract -f csv
