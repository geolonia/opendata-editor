import { ulid } from "ulid";

export function addIdToFeatures(array: any) {
  const features = []
  for(let row of array) {
    const feature = row as any;
    feature['id'] = ulid();
    features.push(feature);
  }
  return features;
}
