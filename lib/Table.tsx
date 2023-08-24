import React, { useCallback } from 'react';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { styled } from 'styled-components';
import { ulid } from 'ulid';
import Button from './Button';

import type { Feature } from './types';

const StyledButton = styled(Button)`
  position: absolute;
  top: 385px;
  right: 35px;
`;
const TWrapper = styled.div`
  overflow: scroll;
  max-width: 100%;
  max-height: 300px;
`;
const Table = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
`;
const Th = styled.th`
  position: sticky;
  top: 0;
  font-size: 12px;
  border: 1px solid #EE730D;
  border-left: none;
  background-color: #fbf1e4;
  color: #EE730D;
  padding: 6px 6px;
  width: 130px;
  z-index: 100; // ThFreezed has to be over Th
`;
const Td = styled.td`
  font-size: 12px;
  border: 1px solid #2b2121;
  border-top: none;
  border-left: none;
  color: #2b2b2b;
  padding: 6px 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 130px;
  max-width: 130px;
  min-width: 130px;
`;
const ThFreezed = styled(Th)`
  position: sticky;
  left: 0;
  border-left: 1px solid #EE730D;
  z-index: 200; // ThFreezed has to be over Th
`;
const TdFreezed = styled(Td)`
  position: sticky;
  left: 0;
  border-left: 1px solid #2b2121;
  background-color: #FFFFFF;
  z-index: 100; // ThFreezed has to be over TdFreezed
`;

interface Props {
  features: Feature[];
  setFeatures: React.Dispatch<React.SetStateAction<Feature[]>>;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRowId: string | null;
  setSelectedRowId: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedOn: React.Dispatch<React.SetStateAction<string | null>>;
  onDataUpdate?: (tableData: Feature[]) => void;
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
    onDataUpdate,
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

    if (onDataUpdate) {
      onDataUpdate(tableData);
    }

    setEditMode(false);
  }, [tableData, onDataUpdate, setEditMode, setFeatures]);

  const deleteTableData = useCallback((id: string) => {
    const tableDataToDelete = features.find((feature) => feature.id === id);

    if (window.confirm(`「${tableDataToDelete?.name}」のデータを削除しても良いですか?`)) {
      setTableData((prevTableData) => {
        const newTableData = [...prevTableData.filter((_tableData) => _tableData.id !== id)];
        setFeatures(newTableData);
        return newTableData;
      });

      if (onDataUpdate) {
        onDataUpdate(tableData);
      }
    }
  }, [features, tableData, onDataUpdate, setFeatures]);

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
          <StyledButton icon={faPlusCircle} onClick={addData}>
            データを追加
          </StyledButton>

          <TWrapper>
            <Table>
              <thead>
                <tr>
                  <ThFreezed key='header-action'></ThFreezed>
                  { headers.map((header, i) => (
                    (header !== 'id') && (header !== 'title') &&
                      <Th key={`header-${headers[i]}`}>{header}</Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                { tableData.map((rowData) => {
                  const selected = rowData['id'] === props.selectedRowId;

                  return (
                    <tr
                      onClick={(e) => jump(e, rowData['id'])}
                      key={rowData['id']}
                      id={`table-data-${rowData['id']}`}
                    >
                      <TdFreezed key={`${rowData['id']}-action`}>
                        {props.editMode && selected ?
                          <button onClick={() => saveTableData(rowData['id'])}>保存</button>
                          :
                          <>
                            <button onClick={() => editTableData(rowData['id'])} disabled={props.editMode}>編集</button>
                            &nbsp;
                            <button onClick={() => deleteTableData(rowData['id'])} disabled={props.editMode}>削除</button>
                          </>
                        }
                      </TdFreezed>

                      { Object.values(rowData).map((column, j) => (
                        (j !== Object.keys(rowData).findIndex((e) => e === 'id')) && (j !== Object.keys(rowData).findIndex((e) => e === 'title')) &&
                          <Td
                            key={`${rowData['id']}-${headers[j]}`}
                            className={headers[j]}
                            style={ selected ? { color: '#fbf1e4', backgroundColor: '#EE730D' } : {}}
                          >
                            {
                              props.editMode && selected ? <input ref={(el) => inputRef.current[j] = el} type="text" defaultValue={column} /> : column
                            }
                          </Td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </TWrapper>
        </>
      )}
    </>
  );
};

export default Component;
