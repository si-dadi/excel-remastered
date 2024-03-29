interface Attributes {
  [key: string]: any;
}

function flattenAttributes(
  jsonObject: any,
  parentKey: string = '',
  separator: string = '.'
): Attributes {
  let attributes: Attributes = {};

  for (let key in jsonObject) {
    if (jsonObject.hasOwnProperty(key)) {
      let fullKey = parentKey ? `${parentKey}${separator}${key}` : key;

      if (Array.isArray(jsonObject[key])) {
        jsonObject[key].forEach((item: any, index: number) => {
          if (typeof item === 'object' && item !== null) {
            attributes = {
              ...attributes,
              ...flattenAttributes(
                item,
                `${fullKey}[${index}]`,
                separator
              ), 
            };
          } else {
            attributes[`${fullKey}[${index}]`] = null; 
          }
        });
      } else if (
        typeof jsonObject[key] === 'object' &&
        jsonObject[key] !== null
      ) {
        attributes = {
          ...attributes,
          ...flattenAttributes(jsonObject[key], fullKey, separator),
        };
      } else {
        attributes[fullKey] = null;
      }
    }
  }

  return attributes;
}

function modifyAttributes(attributes: Attributes): Attributes {
  const modifiedAttributes: Attributes = {};

  for (const key in attributes) {
    const modifiedKey = key.substring(key.indexOf('.') + 1); // Remove everything before the first "." [for attributes of type 10.name.firstname]
    const finalKey = modifiedKey.replace(/\[\d+\]/g, ''); // Remove all occurrences of "[n]"
    modifiedAttributes[finalKey] = attributes[key];
  }

  return modifiedAttributes;
}

function arrangeHeaders(attributes: Attributes): string[][] {
  const csvArray: string[][] = [];
  const levels: Attributes = {};

  Object.keys(attributes).forEach((attribute) => {
    const parts = attribute.split('.');
    let currentLevel = levels;

    parts.forEach((part, index) => {
      if (!currentLevel[part]) {
        currentLevel[part] = {};
      }
      currentLevel = currentLevel[part];

      if (!csvArray[index]) {
        csvArray[index] = [];
      }

      const parentIndex = csvArray[index - 1]
        ? csvArray[index - 1].indexOf(parts[index - 1])
        : -1;
      let currentIndex = csvArray[index].length;

      while (currentIndex < parentIndex) {
        csvArray[index].push('');
        currentIndex++;
      }

      csvArray[index].push(part);
    });
  });

  return csvArray;
}

function removeDuplicatesInSubArrays(csvArray: string[][]): void {
  // Process each row
  for (let i = 0; i < csvArray.length; i++) {
    // Check if csvArray[i] is defined
    if (csvArray[i]) {
      const uniqueValues = new Set<string>();

      csvArray[i].forEach((element, j) => {
        // Check for duplicates within the row and reset if necessary
        for (let k = j + 1; k < csvArray[i].length; k++) {
          // Check if csvArray[i - 1] is defined
          if (csvArray[i - 1] && element !== '' && element === csvArray[i][k] && csvArray[i - 1][k] === '') {
            csvArray[i][k] = '';
          }
        }

        // Check for duplicates within the row and reset if necessary
        if (element !== '' && uniqueValues.has(element)) {
          csvArray[i][j] = '';
        } else {
          uniqueValues.add(element);
        }
      });
    }
  }
}



function getHeaders(jsonObject: object): { csvHeadersArray: string[][]; headers: string[] } {
  const flattenedAttributes = flattenAttributes(jsonObject); // extract all attributes from the json object
  const headers = modifyAttributes(flattenedAttributes); // get all unique headers as an array
  const csvHeadersArray = arrangeHeaders(headers); // arrange them in the required formatting for csv

  removeDuplicatesInSubArrays(csvHeadersArray);

  // Extract keys from the headers object
  const headersArray = Object.keys(headers);

  return { csvHeadersArray, headers: headersArray };
}

export default getHeaders;