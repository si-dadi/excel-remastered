const fs = require("fs");

function getBody(filePath, headers) {
  const jsonString = fs.readFileSync(filePath, "utf-8");
  const jsonObjects = JSON.parse(jsonString);

  function dfs(obj, path) {
    let value = obj;
    path.forEach((attribute) => {
      if (Array.isArray(value)) {
        value = value.map((item) => dfs(item, attribute.split(".")));
        value = value.flat(); 
        value = value.filter((item) => item !== undefined); // Remove undefined values
        if (value.some(Array.isArray)) {
          // Check if any element is an array
          value = value.map((item) => {
            if (Array.isArray(item) && item.length > 0) {
              return JSON.stringify(item); // Convert array with elements to string
            }
            return item;
          });
        }
      } else {
        value = (value && value[attribute]) || null;
      }
    });
    return value;
  }

  let csvBodyArray = jsonObjects.map((obj) => {
    const row = headers.map((header) => {
      return dfs(obj, header.split("."));
    });
    return row;
  });

  // Temporary fix
  // TODO: Map multivalued attributes to different rows => List them one below the other
  function convert2DArrayToStrings(arr) {
    return arr.map((subArray) => {
      return subArray.map((element) => {
        if (Array.isArray(element)) {
          // If element is an array, stringify it
          return JSON.stringify(
            element.map((subElement) => String(subElement))
          ).replace(/,/g, "|"); // Temprary fix to not confuse commas in CSv, Replaced commas with "|"
        } else {
          return String(element);
        }
      });
    });
  }

  csvBodyArray = convert2DArrayToStrings(csvBodyArray);

  return csvBodyArray;
}

module.exports = getBody;
