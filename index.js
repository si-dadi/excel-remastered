const getHeaders = require("./src/JSON2CSV/getHeaders");
const getBody = require("./src/JSON2CSV/getBody");
const fs = require("fs");

function convert_to_csv(inputJsonFile, outputCsvFile) {
  const { csvHeadersArray, headers } = getHeaders(inputJsonFile);
  const csvBodyArray = getBody(inputJsonFile, headers); 
  // console.log("h", csvHeadersArray, "\n", "b", csvBodyArray);

  const csvHeaderContent = csvHeadersArray
    .map((row) => row.join(","))
    .join("\n");

  // Append an empty line to separate header and body
  const csvContent =
    csvHeaderContent +
    "\n\n" +
    csvBodyArray.map((row) => row.join(",")).join("\n");

  fs.writeFileSync(outputCsvFile, csvContent);
}

module.exports = convert_to_csv;