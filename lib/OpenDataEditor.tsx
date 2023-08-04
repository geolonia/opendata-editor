import React from 'react';

import Table from './Table';
import Download from './Download';

import { Buffer } from 'buffer';
import Encoding from 'encoding-japanese';
import Papa from 'papaparse';

import Map from './Map';
import Uploader from './Uploader';

import { addIdToFeatures } from './utils/add-id-to-features';

import './OpenDataEditor.scss';
import { Row, csv2rows } from './utils/csv2geojson';

import type { Feature } from './types';

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
      fetch(path)
        .then((response) => response.arrayBuffer())
        .then((data) => {
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
        });
    }
  }, [data]);

  return (
    <div className="main">
      <div className="container">
        <Uploader className="uploader" setFeatures={setFeatures} filename={filename} setFilename={setFilename} setFitBounds={setFitBounds}></Uploader>
        <Download features={features} filename={filename} />

        <Map
          className="map"
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
      </div>
    </div>
  );
};

export { OpenDataEditor };
