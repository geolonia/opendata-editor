//
// Publicly-exposed types
//

export interface Feature {
  [key: string]: string;
}

//
// Internally-used types
//

export type Cell = {
  rowId: string | undefined,
  rowIdx: number,
  columnIdx: number
};
