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

  let csvBodyArray: any[][] = jsonObjects.map((obj) => {
    const row: any[] = headers.map((header) => {
      return dfs(obj, header.split('.'));
    });
    return row;
  });

  function convert2DArrayToStrings(arr: any[][]): string[][] {
    return arr.map((subArray) => {
      return subArray.map((element) => {
        if (Array.isArray(element)) {
          return JSON.stringify(element.map((subElement) => String(subElement))).replace(/,/g, '|');
        } else {
          return String(element);
        }
      });
    });
  }

  csvBodyArray = convert2DArrayToStrings(csvBodyArray);

  return csvBodyArray;
}

export default getBody;
