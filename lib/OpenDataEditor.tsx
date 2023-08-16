import React from 'react';

import Table from './Table';
import Download from './Download';

import { Buffer } from 'buffer';
import Encoding from 'encoding-japanese';
import Papa from 'papaparse';
import { styled } from 'styled-components';

import Map from './Map';
import Uploader from './Uploader';

import { addIdToFeatures } from './utils/add-id-to-features';
import { Row, csv2rows } from './utils/csv2geojson';

import type { Feature } from './types';

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
  padding: 16px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  box-shadow: 12px 0 8px -8px rgba(243, 152, 19, 0.1) inset;
  z-index: 9999;
`;
const InnerWrapper = styled.div`
  box-sizing: border-box;
  color: #2b2b2b;
  width: 98%;
  margin: 0 auto;
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

type Props = {
  data?: string[][];
  onDataUpdate?: (tableData: Feature[]) => void;
};

const OpenDataEditor = ({ data, onDataUpdate }: Props): JSX.Element => {
  const [ features, setFeatures ] = React.useState<Row[]>([]);
  const [ filename, setFilename ] = React.useState<string>('');
  const [ editMode, setEditMode ] = React.useState(false);
  const [ , setFitBounds ] = React.useState(false);
  const [ selectedRowId, setSelectedRowId ] = React.useState<string | null>(null);
  const [ selectedOn, setSelectedOn ] = React.useState<string | null>(null);

  const hideUploader = () => {
    const el = document.querySelector('.uploader') as HTMLElement;
    el.style.display = 'none';
  };

  React.useEffect(() => {
    if (data) {
      const csv = Papa.unparse(data);
      const { data: formattedData } = Papa.parse<Row>(csv, {
        header: true,
      });
      setFeatures(addIdToFeatures(formattedData));
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
      })();
    }
  }, [data]);

  return (
    <OuterWrapper>
      <InnerWrapper>
        <StyledUploader className="uploader" setFeatures={setFeatures} filename={filename} setFilename={setFilename} setFitBounds={setFitBounds}></StyledUploader>
        <Download features={features} filename={filename} />

        <StyledMap
          features={features}
          setFeatures={setFeatures}
          editMode={editMode}
          setEditMode={setEditMode}
          selectedRowId={selectedRowId}
          setSelectedRowId={setSelectedRowId}
          setFitBounds={setFitBounds}
          selectedOn={selectedOn}
          setSelectedOn={setSelectedOn}
        />

        <Table
          features={features}
          setFeatures={setFeatures}
          editMode={editMode}
          setEditMode={setEditMode}
          selectedRowId={selectedRowId}
          setSelectedRowId={setSelectedRowId}
          setSelectedOn={setSelectedOn}
          onDataUpdate={onDataUpdate}
        />
      </InnerWrapper>
    </OuterWrapper>
  );
};

export {
  OpenDataEditor,
  type Feature,
};
