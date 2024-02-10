function getBody(jsonObjects: object[], headers: string[]): string[][] {

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
              return item;
            }
            return item;
          });
        }
      } else {
        value = (value !== null && value.hasOwnProperty(attribute)) ? value[attribute] : null;
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

  // Flatten the CSV data
  const maxRowLength = Math.max(...csvBodyArray.map(row => row.length));
  csvBodyArray = csvBodyArray.map(row => {
    return row.reduce((acc, cell, i) => {
      const values = Array.isArray(cell) ? cell : [cell];
      values.forEach((value, j) => {
        if (!acc[j]) {
          acc[j] = Array(maxRowLength).fill('');
        }
        acc[j][i] = value;
      });
      return acc;
    }, []);
  }).flat();

  // Handle nested arrays and convert boolean and null values to strings
  csvBodyArray = csvBodyArray.map(row => {
    return row.map(cell => {
      if (Array.isArray(cell)) {
        return cell.join(',');
      } else if (typeof cell === 'boolean' || cell === null) {
        return String(cell);
      }
      return cell;
    });
  });

  return csvBodyArray;
}

export default getBody;
