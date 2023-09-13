import { ulid } from 'ulid';
import type { Feature } from '../types';

export function addIdToFeatures(rows: Feature|Feature[]): Feature[] {
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
