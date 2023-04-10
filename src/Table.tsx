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

  const jump = (id: Number) => {
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
        データを編集するには、セルの上でダブルクリックして下さい。<br />
        データを削除するには、一番左のセルを選択して右クリックして下さい。<br />
        <button className="add-data-button" onClick={addData}>
          <FontAwesomeIcon icon={faPlusCircle} className="button-icon" />
          データを追加
        </button><br />
      </p>
      <table>
        <thead>
          <tr>
            <th></th>
            { headers.map((header) => (
              <th>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          { tableData.map((rowData, idx) => (
            <tr id={`table-data-${rowData['#property']}`}>
              <td>
                <button onClick={() => jump(idx)}>ジャンプ</button>
                <button onClick={() => editTableData(idx)}>編集</button>
                <button onClick={() => deleteTableData(idx)}>削除</button>
              </td>

              { Object.values(rowData).map((column) => (
                <td>{column}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Component;
