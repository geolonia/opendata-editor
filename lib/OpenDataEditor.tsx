import { useCallback, useEffect, useRef, useState } from 'react';
import DataGrid, {
  SelectColumn,
  textEditor,
  type Column,
  type CellMouseEvent,
  type CellClickArgs,
  type CellSelectArgs,
  type DataGridHandle,
} from 'react-data-grid';
import { Menu, Item, Separator, useContextMenu, type ItemParams } from 'react-contexify';

import Download from './Download';

import { Buffer } from 'buffer';
import Encoding from 'encoding-japanese';
import Papa from 'papaparse';
import { styled } from 'styled-components';

import Map from './Map';
import Uploader from './Uploader';

import { addIdToFeatures } from './utils/add-id-to-features';
import { csv2rows } from './utils/csv2geojson';

import type { Cell, Feature } from './types';
import 'react-data-grid/lib/styles.css';
import 'react-contexify/ReactContexify.css';
import { getLatLngColumnNames, getRowById } from './utils/utils';

const baseStyle = `
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  background-color: #ffffff;
`;
const OuterWrapper = styled.div`
  ${baseStyle}
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  z-index: 9999;
`;
const InnerWrapper = styled.div`
  box-sizing: border-box;
  color: #2b2b2b;
  width: 100%;
  padding-left: 2.25rem;
  padding-right: 2.25rem;
  padding-top: 1rem;
`;
const StyledUploader = styled(Uploader)`
  ${baseStyle}
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.7);
`;
const StyledMap = styled(Map)`
  ${baseStyle}
  position: relative;
  width: 100%;
  height: 400px;
  box-sizing: border-box;
  margin-bottom: 20px;
`;

const getColumns = (data: Feature[]): Column<Feature>[] => [
  SelectColumn,
  ...Object.keys(data[0]).map((key) => ({
    key,
    name: key,
    renderEditCell: textEditor,
  })),
];

type Props = {
  data?: string[][];
  onDataUpdate?: (tableData: Feature[]) => void;
};

const OpenDataEditor = ({ data, onDataUpdate }: Props): JSX.Element => {
  const gridRef = useRef<DataGridHandle>(null);
  const selectNewRowOnNextRowUpdate = useRef(false);
  const { show: showContextMenu } = useContextMenu({
    id: 'default',
  });

  const [ features, setFeatures ] = useState<Feature[]>([]);
  const [ columns, setColumns ] = useState<Column<Feature>[]>([]);
  const [ filename, setFilename ] = useState<string>('');
  const [ , setFitBounds ] = useState(false);
  const [ selectedRowIds, setSelectedRowIds ] = useState((): ReadonlySet<string> => new Set());
  const [ selectedOn, setSelectedOn ] = useState<string | null>(null);
  const [ selectedCell, setSelectedCell ] = useState<Cell>({ rowId: undefined, rowIdx: -1, columnIdx: -1 });
  const [ rowIdxWhereContextMenuOpens, setRowIdxWhereContextMenuOpens ] = useState<number>(-1);

  const hideUploader = () => {
    const el = document.querySelector('.uploader') as HTMLElement;
    el.style.display = 'none';
  };

  const onMapPinSelected = useCallback((id: string) => {
    const { rowIdx } = getRowById(features, id);
    gridRef.current?.selectCell({ idx: 0, rowIdx });
  }, [features]);

  const addNewRow = useCallback((latitude: number|string, longitude: number|string, options?: { rowIdx?: number, moveToNewLine?: boolean }) => {
    const { latColumnName, lngColumnName } = getLatLngColumnNames(features);

    if (!latColumnName || !lngColumnName) {
      throw new Error(`latColumnName and/or lngColumnName are undefined: latColumnName is ${latColumnName} and lngColumnName is ${lngColumnName}`);
    }

    const newRow: Feature = {};
    newRow[latColumnName] = latitude.toString();
    newRow[lngColumnName] = longitude.toString();
    newRow.name = '新規マップピン';
    const newRows = addIdToFeatures(newRow);

    if (options?.rowIdx === undefined) {
      setFeatures((previousFeatures) => [ ...previousFeatures, ...newRows ]);
    } else {
      setFeatures([
        ...features.slice(0, options.rowIdx),
        ...newRows,
        ...features.slice(options.rowIdx),
      ]);
    }

    selectNewRowOnNextRowUpdate.current = options?.moveToNewLine ?? false;
  }, [features]);

  const deleteRow = useCallback((rowIdx: number) => {
    setFeatures([
      ...features.slice(0, rowIdx),
      ...features.slice(rowIdx + 1),
    ]);
  }, [features]);

  const onMapPinAdded = useCallback((latitude: number, longitude: number) => {
    addNewRow(latitude, longitude, { moveToNewLine: true });
  }, [addNewRow]);

  useEffect(() => {
    if (selectNewRowOnNextRowUpdate.current === true) {
      const { latIndex, lngIndex } = getLatLngColumnNames(features);
      let columnIdx = 0;

      if (latIndex >= 0) {
        columnIdx = latIndex;
      } else if (lngIndex >= 0) {
        columnIdx = lngIndex;
      }

      gridRef.current?.selectCell({ idx: columnIdx, rowIdx: features.length - 1 });
      selectNewRowOnNextRowUpdate.current = false;
    }
  }, [features]);

  const onMapPinMoved = useCallback((rowId: string, newLatitude: number, newLongitude: number) => {
    const { latColumnName, lngColumnName } = getLatLngColumnNames(features);
    const { rowIdx: movedRowIdx } = getRowById(features, rowId);

    if (!latColumnName || !lngColumnName) {
      throw new Error(`latColumnName and/or lngColumnName are undefined: latColumnName is ${latColumnName} and lngColumnName is ${lngColumnName}`);
    }

    setFeatures([
      ...features.slice(0, movedRowIdx),
      {
        ...features[movedRowIdx],
        [latColumnName]: newLatitude.toString(),
        [lngColumnName]: newLongitude.toString(),
      },
      ...features.slice(movedRowIdx + 1),
    ]);
  }, [features]);

  const onSelectedCellChange = useCallback(({ rowIdx, row, column }: CellSelectArgs<Feature, unknown>) => {
    setSelectedCell({ rowId: row?.id, rowIdx, columnIdx: column.idx });
  }, []);

  const onCellContextMenu = useCallback(({ row: clickedRow, column: clickedColumn }: CellClickArgs<Feature>, event: CellMouseEvent): void => {
    event.preventGridDefault();
    event.preventDefault();

    const clickedRowIdx = features.findIndex((feature) => feature.id === clickedRow.id);
    setRowIdxWhereContextMenuOpens(clickedRowIdx);
    gridRef.current?.selectCell({ idx: clickedColumn.idx, rowIdx: clickedRowIdx });
    showContextMenu({ event });
  }, [features, showContextMenu]);

  const onContextMenuItemClick = useCallback(({ id }: ItemParams) => {
    if (id === 'insert-above' || id === 'insert-below') {
      const { latColumnName, lngColumnName } = getLatLngColumnNames(features);

      if (!latColumnName || !lngColumnName) {
        throw new Error(`latColumnName and/or lngColumnName are undefined: latColumnName is ${latColumnName} and lngColumnName is ${lngColumnName}`);
      }

      const latitude = features[rowIdxWhereContextMenuOpens][latColumnName];
      const longitude = features[rowIdxWhereContextMenuOpens][lngColumnName];

      addNewRow(latitude, longitude, {
        rowIdx: id === 'insert-above' ? rowIdxWhereContextMenuOpens : rowIdxWhereContextMenuOpens + 1,
      });
    } else if (id === 'delete') {
      deleteRow(rowIdxWhereContextMenuOpens);
    } else {
      throw new Error(`Unknown context menu item ID ${id}`);
    }
  }, [addNewRow, deleteRow, features, rowIdxWhereContextMenuOpens]);

  useEffect(() => {
    if (data) {
      const csv = Papa.unparse(data);
      const { data: formattedData } = Papa.parse<Feature>(csv, {
        header: true,
      });
      setFeatures(addIdToFeatures(formattedData));
      setColumns(getColumns(formattedData));
      hideUploader();
    } else if (location.search) {
      const params = new URLSearchParams(location.search);
      const path = params.get('data');

      if (!path) return;

      const filename = path.split('/').pop() || '';
      setFilename(filename);

      (async () => {
        const res = await fetch(path);
        const data = await res.arrayBuffer();
        const buffer = Buffer.from(data);
        const unicodeData = Encoding.convert(buffer, {
          to: 'UNICODE',
          from: 'AUTO',
          type: 'string',
        });
        hideUploader();
        const features = csv2rows(unicodeData);
        setFitBounds(true);
        setFeatures(addIdToFeatures(features));
        setColumns(getColumns(features));
      })();
    }
  }, [data]);

  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate(features);
    }
  }, [features, onDataUpdate]);

  return (
    <OuterWrapper>
      <StyledUploader className="uploader" setFeatures={setFeatures} filename={filename} setFilename={setFilename} setFitBounds={setFitBounds} />
      <InnerWrapper>
        <Download features={features} filename={filename} />

        <StyledMap
          features={features}
          selectedCell={selectedCell}
          selectedRowIds={selectedRowIds}
          onMapPinSelected={onMapPinSelected}
          onMapPinAdded={onMapPinAdded}
          onMapPinMoved={onMapPinMoved}
          setFitBounds={setFitBounds}
          selectedOn={selectedOn}
          setSelectedOn={setSelectedOn}
        />

        <DataGrid
          ref={gridRef}
          rows={features}
          columns={columns}
          defaultColumnOptions={{
            sortable: true,
            resizable: true,
          }}
          rowKeyGetter={(row: Feature) => row.id}
          selectedRows={selectedRowIds}
          onSelectedRowsChange={setSelectedRowIds}
          onRowsChange={setFeatures}
          onSelectedCellChange={onSelectedCellChange}
          onCellContextMenu={onCellContextMenu}
          data-e2e="datagrid"
        />
      </InnerWrapper>

      <Menu id="default">
        <Item id="insert-above" onClick={onContextMenuItemClick}>この行の上に1行追加</Item>
        <Item id="insert-below" onClick={onContextMenuItemClick}>この行の下に1行追加</Item>
        <Separator />
        <Item id="delete" onClick={onContextMenuItemClick}>この行を削除</Item>
      </Menu>
    </OuterWrapper>
  );
};

export {
  OpenDataEditor,
  type Feature,
};
