import React from 'react';

import Table from './Table';
import Download from './Download';

import queryString from "query-string"
import Papa from 'papaparse';

import Map from './Map'
import Uploader from './Uploader'

import { addIdToFeatures } from "./lib/add-id-to-features";

import './Home.scss';

interface Feature {
  [key: string]: string;
}

const Home = () => {
  const [ features, setFeatures ] = React.useState<Feature[]>([]);
  const [ filename, setFilename ] = React.useState<string>('');
  const [ editMode, setEditMode ] = React.useState(false);
  const [ fitBounds, setFitBounds ] = React.useState(false);
  const [ selectedRowId, setSelectedRowId ] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!window.location.search) return;

    const query = queryString.parse(window.location.search);
    const path = query.data as string;

    if (!path) return;

    const filename = path.split('/').pop() || '';
    setFilename(filename);
    fetch(path)
      .then((response) => response.text())
      .then((data) => {
        const features = Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
        }).data as Feature[];
        setFitBounds(true);
        setFeatures([...addIdToFeatures(features)]);
      });
  }, []);

  return (
    <div className="main">
      <div className="container">
        <Uploader className="uploader" setFeatures={setFeatures} setFilename={setFilename} setFitBounds={setFitBounds}></Uploader>
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
        />

        <Table
          features={features}
          setFeatures={setFeatures}
          editMode={editMode}
          setEditMode={setEditMode}
          selectedRowId={selectedRowId}
          setSelectedRowId={setSelectedRowId}
        />
      </div>
    </div>
  );
}

export default Home;
