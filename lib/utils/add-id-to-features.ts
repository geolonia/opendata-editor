import { ulid } from 'ulid';
import { Row } from './csv2geojson';

export function addIdToFeatures(rows: Row|Row[]): Row[] {
  if (Array.isArray(rows)) {
    return rows.map((row) => ({
      ...row,
      id: ulid(),
    }));
  } else {
    return [{
      ...rows,
      id: ulid(),
    }];
  }
}
