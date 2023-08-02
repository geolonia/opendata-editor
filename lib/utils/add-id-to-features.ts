import { ulid } from 'ulid';
import { Row } from './csv2geojson';

export function addIdToFeatures(array: Row[]) {
  const features: Row[] = [];
  for (const row of array) {
    features.push({
      ...row,
      id: ulid(),
    });
  }
  return features;
}
