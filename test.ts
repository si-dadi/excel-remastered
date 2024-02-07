import excelRemastered from './src/index';

const csvData = excelRemastered.jsonToCsv('src/jsonToCsv/example.json');
const download = excelRemastered.jsonToCsv('src/jsonToCsv/example.json', 'src/jsonToCsv/output.csv');

console.log('====================================');
console.log(download);
console.log('====================================');
console.log(csvData);
console.log('====================================');
