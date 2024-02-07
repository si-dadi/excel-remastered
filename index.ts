import getHeaders from "./src/JSON2CSV/getHeaders";
import getBody from "./src/JSON2CSV/getBody";
import fs from "fs";

function convert_to_csv(inputJsonFile: string, outputCsvFile?: string): string {
  const { csvHeadersArray, headers } = getHeaders(inputJsonFile);
  const csvBodyArray = getBody(inputJsonFile, headers);

  const csvHeaderContent = csvHeadersArray
    .map((row: string[]) => row.join(","))
    .join("\n");

  const csvBodyContent = csvBodyArray.map((row: string[]) => row.join(",")).join("\n");

  const csvContent = csvHeaderContent + "\n\n" + csvBodyContent;

  if (outputCsvFile) {
    fs.writeFileSync(outputCsvFile, csvContent);
    return `CSV file written to ${outputCsvFile}`;
  } else {
    return csvContent;
  }
}

export default convert_to_csv;
