import { Feature } from '../types';

export const dedupe = <T>(arr: T[]): T[] =>
  arr.filter((item, i) => arr.indexOf(item) === i);

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
