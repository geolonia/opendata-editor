import React from 'react';

import Table from './Table';
import Download from './Download';

import queryString from "query-string"
import Papa from 'papaparse';

import Map from './Map'
import Uploader from './Uploader'

import './Home.scss';

interface Feature {
  [key: string]: string;
}

const Home = () => {
  const [ features, setFeatures ] = React.useState<Feature[]>([])
  const [ filename, setFilename ] = React.useState<string>('')

  React.useEffect(() => {
    if (window.location.search) {
      const query = queryString.parse(window.location.search)
      if (query.data) {
        const path = query.data as string;
        const filename = path.split('/').pop() || '';
        setFilename(filename);

        // @ts-ignore
        fetch(query.data)
          .then((response) => response.text())
          .then((data) => {
            const features = Papa.parse(data, {
              header: true,
              skipEmptyLines: true,
            }).data as Feature[];
  
            setFeatures([...features]);
          });
      }
    }
  }, []);

  return (
    <div className="main">
      <div className="container">
        <Uploader className="uploader" setFeatures={setFeatures} setFilename={setFilename}></Uploader>
        <Download features={features} filename={filename} />
        <Map className="map" features={features}/>
        <Table features={features} setFeatures={setFeatures} />    
      </div>
    </div>
  );
}

export default Home;
