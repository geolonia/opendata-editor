import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

import { ulid } from "ulid";

import './Table.scss';

interface Props {
  className?: string;
  features: Feature[];
  setFeatures: Function;
  editMode: boolean;
  setEditMode: Function;
  selectedRowId: string | null;
  setSelectedRowId: Function;
}

interface Feature {
  [key: string]: string;
}

const Component = (props: Props) => {
  const [tableData, setTableData] = React.useState<Feature[]>(props.features);
  const inputRef = React.useRef<Array<HTMLInputElement | null>>([]);

  const addData = () => {
    let newTableData: Feature = {}
    for(let key of Object.keys(tableData[0])) {
      newTableData[key] = '';
    }
    const id = ulid();
    newTableData['id'] = id;
    setTableData([...tableData, newTableData]);
    props.setEditMode(true);
    props.setSelectedRowId(id);
  }

  const jump = (e: any, id: string) => {
    if ((e.target.localName === 'button') || (e.target.localName === 'input')) return;
    props.setEditMode(false);
    props.setSelectedRowId(id);
  }

  const editTableData = (id: string) => {
    props.setEditMode(true);
    props.setSelectedRowId(id);
  }

  const saveTableData = (id: string) => {
    setTableData(prevTableData => {
      const newTableData = prevTableData.map((_tableData) => {
        if (_tableData.id !== id) {
          return _tableData;
        } else {
          const replacedTableData : Feature = {};
          for(let i = 0; i < Object.keys(_tableData).length - 1; i++) {
            const key: string = Object.keys(_tableData)[i];
            replacedTableData[key] = inputRef.current[i]?.value as string;
          }
          replacedTableData['id'] = id;
          return replacedTableData;
        }
      })
      props.setFeatures([...newTableData]);
      return newTableData;
    })
    props.setEditMode(false);
  }

  const deleteTableData = (id: string) => {
    setTableData(prevTableData => {
      const newTableData = [...prevTableData.filter((_tableData) => _tableData.id !== id)];
      props.setFeatures(newTableData);
      return newTableData;
    })
  }

  const headers = tableData[0] ? Object.keys(tableData[0]) : [];

  React.useEffect(() => {
    setTableData(props.features);
  }, [props.features])

  React.useEffect(() => {
    document.getElementById(`table-data-${props.selectedRowId}`)?.scrollIntoView();
  }, [props.selectedRowId])

  return (
    <>
      {tableData.length > 0 && (
        <>
          <button className="add-data-button" onClick={addData}>
          <FontAwesomeIcon icon={faPlusCircle} className="button-icon" />
          データを追加
          </button>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th key='header'></th>
                  { headers.map((header, i) => (
                    (header !== 'id') &&
                      <th key={`header-${i}-${headers.length}`}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                { tableData.map((rowData) => (
                  <tr onClick={(e) => jump(e, rowData['id'])} key={rowData['id']} id={`table-data-${rowData['id']}`} className={rowData['id'] === props.selectedRowId ? 'selected' : ''}>
                    <td key={`${rowData['id']}-action`}>
                      {props.editMode && (rowData['id'] === props.selectedRowId) ?
                        <button onClick={() => saveTableData(rowData['id'])}>保存</button>
                        :
                        <>
                          <button onClick={() => editTableData(rowData['id'])} disabled={props.editMode}>編集</button>
                          &nbsp;
                          <button onClick={() => deleteTableData(rowData['id'])} disabled={props.editMode}>削除</button>
                        </>
                      }
                    </td>

                    { Object.values(rowData).map((column, j) => (
                      (j !== Object.keys(rowData).findIndex((e) => e === 'id')) &&
                        <td key={`${rowData['id']}-${j}`}>{
                          props.editMode && rowData['id'] === props.selectedRowId ? <input ref={el => inputRef.current[j] = el} type="text" defaultValue={column} /> : column
                        }</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

export default Component;
