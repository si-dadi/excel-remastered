function getBody(jsonObjects: object | object[], headers: string[]): string[][] {
  if (!Array.isArray(jsonObjects)) {
    jsonObjects = [jsonObjects];
  }

  function dfs(obj: object, path: string[]): any {
    let value: any = obj;
    path.forEach((attribute) => {
      if (Array.isArray(value)) {
        value = value.map((item: any) => dfs(item, attribute.split('.')));
        value = value.flat();
        value = value.filter((item: any) => item !== undefined);
        if (value.some(Array.isArray)) {
          value = value.map((item: any) => {
            if (Array.isArray(item) && item.length > 0) {
              return JSON.stringify(item);
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

  let csvBodyArray: any[][] = (jsonObjects as object[]).map((obj) => { // Type assertion
    const row: any[] = headers.map((header) => {
      return dfs(obj, header.split('.'));
    });
    return row;
  });

  // Transpose the CSV data to 1NF
  const transposedData: string[][] = [];
  csvBodyArray.forEach(row => {
    row.forEach((value, index) => {
      if (Array.isArray(value)) {
        value.forEach((element, subIndex) => {
          if (!transposedData[subIndex]) {
            transposedData[subIndex] = [];
          }
          transposedData[subIndex][index] = element === null ? '' : element;
        });
      } else {
        if (!transposedData[0]) {
          transposedData[0] = [];
        }
        transposedData[0][index] = value === null ? '' : value;
      }
    });
  });

  return transposedData;
}

export default getBody;