import readXlsxFile from 'read-excel-file';

interface Feature {
  [key: string]: string;
}

export const xlsParser = async (buffer: ArrayBuffer) => {
  const array = await readXlsxFile(buffer);
  const header = array[0];

  const data: any[] = [];
  for (let i = 1; i < array.length; i++) {
    const row = array[i];

    const object: Feature = {};

    for (let j = 0; j < row.length; j++) {
      const key = header[j] as string;
      const value = row[j] as string;
      object[key] = value;
    }
    data.push(object);
  }

  return data;
};
