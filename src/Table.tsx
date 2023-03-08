import React from 'react';
import { ReactGrid, Column, Row, CellChange, TextCell } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";

interface Props {
  className?: string;
  data: GeoJSON.FeatureCollection
}

interface TableData {
  [key: string]: string;
}

const applyChangesToData = (
  changes: CellChange<TextCell>[],
  prevTableData: TableData[]
): TableData[] => {
  changes.forEach((change) => {
    const index = change.rowId as number;
    const fieldName = change.columnId;
    prevTableData[index][fieldName] = change.newCell.text;
  });
  return [...prevTableData];
};

const Component = (props: Props) => {
  const properties = props.data.features.map((feature) => { return feature.properties as TableData })
  const [tableData, setTableData] = React.useState<TableData[]>(properties);

  const handleChanges = (changes: CellChange[]) => {
    const textCellChanges = changes.filter(x => x.type === 'text') as CellChange<TextCell>[];
    setTableData((prevTableData) => applyChangesToData(textCellChanges, prevTableData));
  };

  const headerRow: Row = {
    rowId: "header",
    cells: properties[0] ? Object.keys(properties[0]).map((key) => {
      return { type: "header", text: key };
    }) : []
  };

  const getRows = (tableData: TableData[]): Row[] => [
    headerRow,
    ...tableData.map<Row>((rowData, idx) => ({
      rowId: idx,
      cells: Object.values(rowData).map((column) => { return {type: "text", text: column}})
    }))
  ];

  const getColumns = (): Column[] => properties[0] ? Object.keys(properties[0]).map((key) => {
    return { columnId: key, width: 150 };
  }) : [];
  
  const rows = getRows(tableData);
  const columns = getColumns();
  return (
    <div className="main">
      <div className="container">
        <p>{props.data.features.length}件のデータが登録されています。</p>
        <ReactGrid rows={rows} columns={columns} onCellsChanged={handleChanges}/>
      </div>
    </div>
  );
}

export default Component;
