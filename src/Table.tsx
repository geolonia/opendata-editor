import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

import './Table.scss';

interface Props {
  className?: string;
  features: Feature[];
  setFeatures: Function;
  setEditMode: Function;
  setSelectedRowId: Function;
  selectedRowId: String | null;
}

interface Feature {
  [key: string]: string;
}

const Component = (props: Props) => {
  const [tableData, setTableData] = React.useState<Feature[]>(props.features);

  const addData = () => {
    let newTableData: Feature = {}
    for(let key of Object.keys(tableData[0])) {
      newTableData[key] = '';
    }
    setTableData([...tableData, newTableData]);
  }

  const jump = (id: String) => {
    props.setEditMode(false);
    props.setSelectedRowId(id);
  }

  const editTableData = (id: Number) => {
    props.setEditMode(true);
    props.setSelectedRowId(id);
  }

  const deleteTableData = (id: Number) => {
    setTableData(prevTableData => {
      const newTableData = [...prevTableData.filter((_tableData, idx) => idx !== id)];
      props.setFeatures(newTableData);
      return newTableData
    })
  }

  const headers = tableData[0] ? Object.keys(tableData[0]) : [];

  React.useEffect(() => {
    setTableData(props.features);
  }, [props.features])

  return (
    <>
      <p>
        <button className="add-data-button" onClick={addData}>
          <FontAwesomeIcon icon={faPlusCircle} className="button-icon" />
          データを追加
        </button><br />
      </p>
      <table>
        <thead>
          <tr>
            <th key='header'></th>
            { headers.map((header, i) => (
              <th key={`header-${i}`}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          { tableData.map((rowData, i) => (
            <tr key={rowData['id']} id={`table-data-${rowData['id']}`} className={rowData['id'] === props.selectedRowId ? 'selected' : ''}>
              <td key={`${rowData['id']}-action`}>
                <button onClick={() => jump(rowData['id'])}>ジャンプ</button>
                <button onClick={() => editTableData(i)}>編集</button>
                <button onClick={() => deleteTableData(i)}>削除</button>
              </td>

              { Object.values(rowData).map((column, j) => (
                <td key={`${rowData['id']}-${j}`}>{column}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Component;
