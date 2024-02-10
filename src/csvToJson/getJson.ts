import { readFileSync, writeFileSync } from 'fs';

function csvToJson(csvFilePath : string, jsonFilePath : string, excelRemasteredCSV : boolean) {
    
    if(excelRemasteredCSV === false){
        try {
            const csvData = readFileSync(csvFilePath, 'utf-8');
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
            console.log('CSV file has been converted to JSON format.');
        } catch (error) {
            console.error(`Error while converting CSV to JSON: ${error}`);
        }
    }

}

export default csvToJson;