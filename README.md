# excel-remastered

Node package for better readability of complex nested JSON data downloaded as excel

### Installation
```
npm install excel-remastered@latest
```

## Using the package

```
const excelRemastered = require("excel-remastered");

// provide a json file as string or a json Object directly
const csvData = excelRemastered.jsonToCsv(inputJsonFile)

// if output file path is provided, the csv file will be downloaded
const download = excelRemastered.jsonToCsv(inputJsonFile, outputCsvFile)

console.log('====================================');
console.log(csvData);
console.log('====================================');
console.log(download);
console.log('====================================');
```

## Release Notes (0.2.0)

This (beta release) package introduces initial functionality for users to evaluate the CSV formatting generated from JSON data. Subsequent versions will allow users to convert JSON data to CSV and vice versa. File conversions from CSV <-> Excel <-> PDF might also be expected in the future.
