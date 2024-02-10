import { readFileSync, writeFileSync } from 'fs';

function csvToJson(csvFilePath: string, jsonFilePath: string, excelRemasteredCSV: boolean) {
    try {
        const csvData = readFileSync(csvFilePath, 'utf-8');
        if (excelRemasteredCSV) {
            const [csvHeaderContent, csvBodyContent] = csvData.split('\n\n');
            const headers = csvHeaderContent.split('\n').map(row => row.split(',').map(item => item.slice(1, -1)));
            const body = csvBodyContent.split('\n').map(row => row.split(',').map(item => item.slice(1, -1)));

            const jsonContent = body.map(row => {
                return row.reduce((obj, cell, i) => {
                    const path = headers[i];
                    let current: { [key: string]: any } = obj; // Add index signature to current object
                    for (let j = 0; j < path.length - 1; j++) {
                        if (!current[path[j]]) {
                            current[path[j]] = {};
                        }
                        current = current[path[j]];
                    }
                    current[path[path.length - 1]] = cell;
                    return obj;
                }, {});
            });

            writeFileSync(jsonFilePath, JSON.stringify(jsonContent, null, 2));
        } else {
            const lines = csvData.split('\n');
            const headers = lines[0].split(',');

            const jsonObj = lines.slice(1).map(line => {
                const data = line.split(',');
                return headers.reduce((obj: { [key: string]: string }, header, index) => {
                    obj[header] = data[index];
                    return obj;
                }, {});
            });

            writeFileSync(jsonFilePath, JSON.stringify(jsonObj, null, 2));
        }
        console.log('CSV file has been converted to JSON format.');
    } catch (error) {
        console.error(`Error while converting CSV to JSON: ${error}`);
    }
}

export default csvToJson;
