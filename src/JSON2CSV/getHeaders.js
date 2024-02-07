const fs = require("fs");

function flattenAttributes(jsonObject, parentKey = "", separator = ".") {
  let attributes = {};

  for (let key in jsonObject) {
    if (jsonObject.hasOwnProperty(key)) {
      let fullKey = parentKey ? `${parentKey}${separator}${key}` : key;

      if (Array.isArray(jsonObject[key])) {
        jsonObject[key].forEach((item, index) => {
          if (typeof item === "object" && item !== null) {
            attributes = {
              ...attributes,
              ...flattenAttributes(item, `${fullKey}[${index}]`, separator), // Include array index in the key
            };
          } else {
            attributes[`${fullKey}[${index}]`] = null; // Include array index in the key
          }
        });
      } else if (
        typeof jsonObject[key] === "object" &&
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

function modifyAttributes(attributes) {
  const modifiedAttributes = {};

  for (const key in attributes) {
    const modifiedKey = key.substring(key.indexOf(".") + 1); // Remove everything before the first "."
    const finalKey = modifiedKey.replace(/\[\d+\]/g, ''); // Remove all occurrences of "[n]"
    modifiedAttributes[finalKey] = attributes[key];
  }

  return modifiedAttributes;
}

function arrangeHeaders(attributes) {
  const csvArray = [];
  const levels = {};

  Object.keys(attributes).forEach((attribute) => {
    const parts = attribute.split(".");
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
        csvArray[index].push("");
        currentIndex++;
      }

      csvArray[index].push(part);
    });
  });

  return csvArray;
}

function removeDuplicatesInSubArrays(csvArray) {
  const uniqueValuesFirstSubArray = new Set();

  // Process subsequent sub-arrays
  for (let i = 1; i < csvArray.length; i++) {
    const uniqueValues = new Set();

    csvArray[i].forEach((element, j) => {
      // Check for duplicates within the sub-array fragment and reset if necessary
      if (element !== "" && csvArray[i - 1][j] !== "") {
        if (uniqueValues.has(element)) {
          csvArray[i][j] = "";
        } else {
          uniqueValues.add(element);
        }
      }
    });
  }
  // Process the first sub-array
  csvArray[0].forEach((element, j) => {
    if (j > 0) {
      if (uniqueValuesFirstSubArray.has(element)) {
        csvArray[0][j] = "";
      } else {
        uniqueValuesFirstSubArray.add(element);
      }
    }
  });
}

function getHeaders(filePath) {
  const jsonString = fs.readFileSync(filePath, "utf-8");
  const nestedJson = JSON.parse(jsonString);

  const flattenedAttributes = flattenAttributes(nestedJson);
  const headers = modifyAttributes(flattenedAttributes); // Modify attributes
  const csvHeadersArray = arrangeHeaders(headers);

  removeDuplicatesInSubArrays(csvHeadersArray);

  // Extract keys from the headers object
  const headersArray = Object.keys(headers);

  return { csvHeadersArray, headers: headersArray };
}

module.exports = getHeaders;
