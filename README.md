# excel-remastered

Node package for better readability of complex nested JSON data downloaded as excel

### Installation
```
npm install excel-remastered@latest
```

## Using the package

```
import excelRemastered from './src/index';

// pass an object or array of objects or JSON file path as parameter
const csvData = excelRemastered.jsonToCsv(data); 

// Giving the second optional parameter will write the CSV to the file path provided
const download = excelRemastered.jsonToCsv(jsonFilePath, csvFilePath);

console.log('====================================');
console.log(download);
console.log('====================================');
console.log(csvData);
console.log('====================================');

```

## Release Notes (0.2.0)

This (beta release) package introduces initial functionality for users to evaluate the CSV formatting generated from JSON data. Subsequent versions will allow users to convert JSON data to CSV and vice versa. File conversions from CSV <-> Excel <-> PDF might also be expected in the future.
