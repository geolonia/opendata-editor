import { Feature } from '../types';

export const getRowById = (rows: Feature[], rowId: string): { row: Feature, rowIdx: number } => {
  const rowIdx = rows.findIndex((row) => row.id === rowId);
  const row = rows[rowIdx];

  if (!row) {
    throw new Error(`Invalid rowId given: row with ID '${rowId}' does not exist.`);
  }

  return { row, rowIdx };
};

export const getLatLngColumnNames = (row: Feature | Feature[]): { latColumnName?: string, lngColumnName?: string, latIndex: number, lngIndex: number } => {
  const latColumnCandidates = [ '緯度', 'lat', 'latitude', '緯度（10進法）', '緯度(10進法)'] as const;
  const lngColumnCandidates = [ '経度', 'lng', 'longitude', '経度（10進法）', '経度(10進法)' ] as const;
  const columnNames = Object.keys(Array.isArray(row) ? row[0] : row);

  const latIndex = latColumnCandidates.findIndex((latColumnCandidate) => columnNames.includes(latColumnCandidate));
  const lngIndex = lngColumnCandidates.findIndex((lngColumnCandidate) => columnNames.includes(lngColumnCandidate));
  return {
    latColumnName: latColumnCandidates[latIndex],
    lngColumnName: lngColumnCandidates[lngIndex],
    latIndex,
    lngIndex,
  };
};

export const getInvalidFeatureIndexes = (features: Feature[]): number[] => {
  if (features.length === 0) {
    return [];
  }

  const { latColumnName, lngColumnName } = getLatLngColumnNames(features[0]);

  if (!latColumnName || !lngColumnName) {
    return [];
  }

  const invalidIndexes: number[] = [];

  for (const [i, feature] of features.entries()) {
    const lng = Number(feature[lngColumnName]);
    const lat = Number(feature[latColumnName]);

    if (!(lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90)) {
      invalidIndexes.push(i);
    }
  }

  return invalidIndexes;
};
