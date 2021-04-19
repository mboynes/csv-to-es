const process = require('process');

const { postToEs } = require('./src/postToEs');
const { readCsvData } = require('./src/readCsvData');

const [,, esUrl, ...csvFiles] = process.argv;

if (!esUrl || csvFiles.length === 0) {
	console.error('Invalid arguments! Call index.js <elasticsearch-url> <csv files>');
	process.exit(1);
}

function importFiles(url, files) {
	const [file, ...rest] = files;
	readCsvData(file).then(
		(data) => {
			postToEs(url, data).then(() => {
				console.log(`Completed file ${file}`);
				rest.length > 0 ? importFiles(url, rest) : console.log('Process complete!');
			});
		}
	);
}

importFiles(esUrl, csvFiles);
