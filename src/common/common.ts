export function generateMock(data: any, elements: number) {
  let arr: any = [];
  for (let i = 0; i < elements; i++) {
    let elem: any = {};
    Object.keys(data).forEach((elemField: any) => {
      const variantsLength: number = data[elemField].length - 1;
      const randomKey: number = Math.round(
        0 - 0.5 + Math.random() * (variantsLength + 1)
      );
      elem[elemField] = data[elemField][randomKey];
    });
    elem.id = i + 1;
    arr.push(elem);
  }
  return arr;
}

export function getFileSize(filesize: number) {
  if (!filesize) {
    return "0 Мб";
  }
  if (filesize / 1000 < 1000) {
    return (filesize / 1000).toFixed(1) + " Кб";
  } else {
    return (filesize / 1000 / 1000).toFixed(1) + " Мб";
  }
  return false;
}
