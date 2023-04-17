import { ulid } from "ulid";
import { Row } from "./csv2geojson";

export function addIdToFeatures(array: Row[]) {
  const features: Row[] = [];
  for (let row of array) {
    features.push({
      ...row,
      id: ulid(),
    });
  }
  return features;
}
