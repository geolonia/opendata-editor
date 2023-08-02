import React from 'react';

import Table from './Table';
import Download from './Download';

import queryString from 'query-string';

import { Buffer } from 'buffer';
import Encoding from 'encoding-japanese';

import Map from './Map';
import Uploader from './Uploader';

import { addIdToFeatures } from './utils/add-id-to-features';

import './OpenDataEditor.scss';
import { Row, csv2rows } from './utils/csv2geojson';

const OpenDataEditor = (): JSX.Element => {
  const [ features, setFeatures ] = React.useState<Row[]>([]);
  const [ filename, setFilename ] = React.useState<string>('');
  const [ editMode, setEditMode ] = React.useState(false);
  const [ , setFitBounds ] = React.useState(false);
  const [ selectedRowId, setSelectedRowId ] = React.useState<string | null>(null);
  const [ selectedOn, setSelectedOn ] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!window.location.search) return;

    const query = queryString.parse(window.location.search);
    const path = query.data as string;

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
        const el = document.querySelector('.uploader') as HTMLElement;
        el.style.display = 'none';
        const features = csv2rows(unicodeData);
        setFitBounds(true);
        setFeatures(addIdToFeatures(features));
      });
  }, []);

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
        />
      </div>
    </div>
  );
};

export { OpenDataEditor };
