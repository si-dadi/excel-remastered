import getHeaders from "./jsonToCsv/getHeaders";
import getBody from "./jsonToCsv/getBody";
import fs from "fs";

function jsonToCsv(inputData: string | object, outputCsvFile?: string): string {
  let jsonContent: any;

  // Check if inputData is a string (file path) or a json object
  if (typeof inputData === 'string') {
    const jsonString = fs.readFileSync(inputData, 'utf8');
    jsonContent = JSON.parse(jsonString);
  } else if (typeof inputData === 'object') {
    jsonContent = inputData;
  }

  // Ensure jsonContent is an array
  if (!Array.isArray(jsonContent)) {
    jsonContent = [jsonContent];
  }

  const { csvHeadersArray, headers } = getHeaders(jsonContent);
  const csvBodyArray = getBody(jsonContent, headers);

  const csvHeaderContent = csvHeadersArray
    .map((row: string[]) => row.map(item => `"${item}"`).join(","))
    .join("\n");

  const csvBodyContent = csvBodyArray
    .map((row: string[]) => row.map(item => `"${item}"`).join(","))
    .join("\n");

  const csvContent = csvHeaderContent + "\n\n" + csvBodyContent;

  if (outputCsvFile) {
    fs.writeFileSync(outputCsvFile, csvContent);
    return `CSV file written to ${outputCsvFile}`;
  } else {
    return csvContent;
  }
}

const excelRemastered = { jsonToCsv };

export default excelRemastered;
