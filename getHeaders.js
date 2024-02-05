const fs = require("fs");

function flattenAttributes(jsonObject, parentKey = "", separator = ".") {
  let attributes = {};

  for (let key in jsonObject) {
    if (jsonObject.hasOwnProperty(key)) {
      let fullKey = parentKey ? `${parentKey}${separator}${key}` : key;

      if (Array.isArray(jsonObject[key])) {
        jsonObject[key].forEach((item) => {
          if (typeof item === "object" && item !== null) {
            attributes = {
              ...attributes,
              ...flattenAttributes(item, fullKey, separator),
            };
          } else {
            attributes[fullKey] = null;
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
        const parentKeyWithoutArray = parentKey.split("[")[0];
        const finalKey = parentKeyWithoutArray
          ? `${parentKeyWithoutArray}${separator}${key}`
          : key;
        attributes[finalKey] = null;
      }
    }
  }

  return attributes;
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
  csvArray.forEach((subArray, i) => {
    const uniqueValues = new Set();

    for (let j = 0; j < subArray.length; j++) {
      const element = subArray[j];

      if (element !== "") {
        if (i > 0 && uniqueValues.has(element) && csvArray[i - 1][j] !== "") {
          subArray[j] = "";
        } else {
          uniqueValues.add(element);
        }
      }
    }
  });
}

function processJsonToCSV(filePath) {
  const jsonString = fs.readFileSync(filePath, "utf-8");
  const nestedJson = JSON.parse(jsonString);

  const flattenedAttributes = flattenAttributes(nestedJson);
  const csvArray = arrangeHeaders(flattenedAttributes);

  removeDuplicatesInSubArrays(csvArray);

  return csvArray;
}

module.exports = processJsonToCSV;
