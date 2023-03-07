import React from 'react';
import { ReactGrid, Column, Row } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";

interface Props {
  className?: string;
  data: GeoJSON.FeatureCollection
}

interface TableData {
  [key: string]: string;
}

const Component = (props: Props) => {
  const properties = props.data.features.map((feature) => { return feature.properties })
  const [tableData] = React.useState<TableData[] | any>(properties);

  const headerRow: Row = {
    rowId: "header",
    cells: properties[0] ? Object.keys(properties[0]).map((key) => {
      return { type: "header", text: key };
    }) : [{ type: "header", text: "" }]
  };

  const getRows = (tableData: TableData[]): Row[] => [
    headerRow,
    ...tableData.map<Row>((rowData, idx) => ({
      rowId: idx,
      cells: Object.values(rowData).map((column) => { return {type: "text", text: column}})
    }))
  ];

  const getColumns = (): Column[] | null => properties[0] && Object.keys(properties[0]).map((key) => {
    return { columnId: key, width: 150 };
  });
  
  const rows = getRows(tableData);
  const columns = getColumns();
  return (
    <div className="main">
      <div className="container">
        <p>{props.data.features.length}件のデータが登録されています。</p>
        {columns && rows &&
          <ReactGrid rows={rows} columns={columns} />
        }
      </div>
    </div>
  );
}

export default Component;
