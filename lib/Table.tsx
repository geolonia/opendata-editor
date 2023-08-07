import React, { useCallback } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import { ulid } from 'ulid';

import './Table.scss';

interface Props {
  className?: string;
  features: Feature[];
  setFeatures: React.Dispatch<React.SetStateAction<Feature[]>>;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRowId: string | null;
  setSelectedRowId: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedOn: React.Dispatch<React.SetStateAction<string | null>>;
}

interface Feature {
  [key: string]: string;
}

const Component = (props: Props) => {
  const [tableData, setTableData] = React.useState<Feature[]>(props.features);
  const inputRef = React.useRef<Array<HTMLInputElement | null>>([]);

  const {
    setEditMode,
    setSelectedRowId,
    setFeatures,
    features,
    selectedRowId,
    setSelectedOn,
  } = props;

  const addData = useCallback(() => {
    const newTableData: Feature = {};
    for (const key of Object.keys(tableData[0])) {
      newTableData[key] = '';
    }
    const id = ulid();
    newTableData['id'] = id;
    setTableData([...tableData, newTableData]);
    setEditMode(true);
    setSelectedRowId(id);
  }, [tableData, setEditMode, setSelectedRowId]);

  const jump = useCallback((e: any, id: string) => {
    if ((e.target.localName === 'button') || (e.target.localName === 'input')) return;
    setEditMode(false);
    setSelectedRowId(id);
    setSelectedOn('table');
  }, [setEditMode, setSelectedRowId, setSelectedOn]);

  const editTableData = useCallback((id: string) => {
    setEditMode(true);
    setSelectedRowId(id);
  }, [setEditMode, setSelectedRowId]);

  const saveTableData = useCallback((id: string) => {
    setTableData((prevTableData) => {
      const newTableData = prevTableData.map((_tableData) => {
        if (_tableData.id !== id) {
          return _tableData;
        }

        const replacedTableData : Feature = {};
        for (let i = 0; i < Object.keys(_tableData).length - 1; i++) {
          const key: string = Object.keys(_tableData)[i];
          replacedTableData[key] = inputRef.current[i]?.value as string;
        }
        replacedTableData['id'] = id;
        return replacedTableData;
      });
      setFeatures(newTableData);
      return newTableData;
    });
    setEditMode(false);
  }, [setFeatures, setEditMode]);

  const deleteTableData = useCallback((id: string) => {
    const tableData = features.find((feature) => feature.id === id);

    if (window.confirm(`「${tableData?.name}」のデータを削除しても良いですか?`)) {
      setTableData((prevTableData) => {
        const newTableData = [...prevTableData.filter((_tableData) => _tableData.id !== id)];
        setFeatures(newTableData);
        return newTableData;
      });
    }
  }, [features, setFeatures]);

  const headers = tableData[0] ? Object.keys(tableData[0]) : [];

  React.useEffect(() => {
    setTableData(features);
  }, [features]);

  React.useEffect(() => {
    document.getElementById(`table-data-${selectedRowId}`)?.scrollIntoView();
  }, [selectedRowId]);

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
                  <th key='header-action'></th>
                  { headers.map((header, i) => (
                    (header !== 'id') && (header !== 'title') &&
                      <th key={`header-${headers[i]}`}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                { tableData.map((rowData) => (
                  <tr
                    onClick={(e) => jump(e, rowData['id'])}
                    key={rowData['id']}
                    id={`table-data-${rowData['id']}`}
                    className={classNames({
                      selected: rowData['id'] === props.selectedRowId,
                    })}
                  >
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
                      (j !== Object.keys(rowData).findIndex((e) => e === 'id')) && (j !== Object.keys(rowData).findIndex((e) => e === 'title')) &&
                        <td key={`${rowData['id']}-${headers[j]}`} className={headers[j]}>{
                          props.editMode && rowData['id'] === props.selectedRowId ? <input ref={(el) => inputRef.current[j] = el} type="text" defaultValue={column} /> : column
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
};

export default Component;
