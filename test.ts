import excelRemastered from './src/index';

// fetch your APIs etc and give them as a parameter
// Alt: JSON File Path can be provided as well. 
const data = {
    
  "page": 1,
  "total_results": 10000,
  "total_pages": 500,
  "results": []
}
const csvData = excelRemastered.jsonToCsv(data);

// Giving the second optional parameter will write the CSV to the file path provided
const download = excelRemastered.jsonToCsv('src/jsonToCsv/exampleData/example-testing.json', 'src/jsonToCsv/output.csv');

console.log('====================================');
console.log(csvData);
console.log('====================================');
console.log(download);
console.log('====================================');
