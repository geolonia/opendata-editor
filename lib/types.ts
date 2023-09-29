//
// Publicly-exposed types
//

export interface Feature {
  [key: string]: string;
}

//
// Internally-used types
//

declare global {
  interface Window {
    geoloniaDebug: { [key: string]: unknown }
  }
}

export type Cell = {
  rowId: string | undefined,
  rowIdx: number,
  columnIdx: number
};
