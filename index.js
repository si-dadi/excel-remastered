const processJsonToCSV = require("./getHeaders");
const fs = require("fs");

function convert_to_csv(inputJsonFile, outputCsvFile) {
  const csvArray = processJsonToCSV(inputJsonFile);

  console.log(csvArray);

  const csvContent = csvArray.map((row) => row.join(",")).join("\n");

  fs.writeFileSync(outputCsvFile, csvContent);

  console.log(`CSV file '${outputCsvFile}' has been created.`);
}

module.exports = convert_to_csv;