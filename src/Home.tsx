import React from 'react';

import Table from './Table';
import Download from './Download';
import Settings from './Settings';
import Edit from './Edit';

import {
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";

import Map from './Map'
import Uploader from './Uploader'
import Menu from './Menu'

import './Home.scss';

interface TableData {
  [key: string]: string;
}

const geojson = {
  "type": "FeatureCollection",
  "features": []
} as GeoJSON.FeatureCollection

const Home = () => {
  const [ map, setMap ] = React.useState()
  const [ data, setData ] = React.useState<GeoJSON.FeatureCollection>(geojson)
  const [ csvData, setCsvData ] = React.useState<TableData[]>([])

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/table" element={<Table data={data} csvData={csvData} />} />
        <Route path="/download" element={<Download data={data} />} />
        <Route path="/settings" element={<Settings data={data} />} />
        <Route path="/edit/:id" element={<Edit data={data} />} />
      </Routes>
      <Uploader className="uploader" map={map} dataCallback={setData} csvDataCallback={setCsvData}></Uploader>
      <Menu className='menu'></Menu>
      <Map className="map" setmap={setMap} />
    </HashRouter>
  );
}

export default Home;
