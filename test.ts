const convert_to_csv = require('./index').default;

const csvData = convert_to_csv('example.json');
const download = convert_to_csv('example.json', 'output.csv');

console.log('====================================');
console.log(download);
console.log('====================================');
console.log(csvData);
console.log('====================================');