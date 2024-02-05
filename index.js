const processJsonToCSV = require("./getHeaders");
const fs = require("fs");

function convert_to_csv(inputJsonFile, outputCsvFile) {
  const csvArray = processJsonToCSV(inputJsonFile);

  const csvContent = csvArray.map((row) => row.join(",")).join("\n");

  fs.writeFileSync(outputCsvFile, csvContent);
}

module.exports = convert_to_csv;