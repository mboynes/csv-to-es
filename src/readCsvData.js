const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

function readCsvData(filename) {
  return new Promise((resolve, reject) => {
    const data = [];

    fs.createReadStream(path.resolve(__dirname, filename))
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => reject(error))
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', () => resolve(data));
  });
}

exports.readCsvData = readCsvData;
