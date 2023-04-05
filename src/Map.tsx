import React from 'react';

import { csv2geojson } from "./lib/csv2geojson";
import Papa from 'papaparse';

import './Map.scss';

declare global {
  interface Window {
    geolonia: any;
  }
}

interface Feature {
  [key: string]: string;
}

interface Props {
    className: string;
    features: Feature[];
    featureSelected: Feature | null;
}

const Component = (props: Props) => {
  const mapContainer = React.useRef<HTMLDivElement>(null)
  const [simpleStyle, setSimpleStyle] = React.useState()
  const [map, setMap] = React.useState()

  React.useEffect(() => {
    const map = new window.geolonia.Map({
      container: mapContainer.current,
      style: "geolonia/gsi",
      hash: true,
    })
    setMap(map);

    map.on("load", () => {
      const sourceId = 'custom-geojson'
      const geojson = {
        "type": "FeatureCollection",
        "features": []
      } as GeoJSON.FeatureCollection
      const simpleStyle = new window.geolonia.simpleStyle(geojson, {id: sourceId}).addTo(map).fitBounds()
      setSimpleStyle(simpleStyle)
    })
  }, [mapContainer])

  React.useEffect(() => {
    if (simpleStyle) {
      const string = Papa.unparse(props.features);
      const geojson = csv2geojson(string);

      // @ts-ignore
      simpleStyle.updateData(geojson).fitBounds();
    }
  }, [simpleStyle, props.features])

  React.useEffect(() => {
    if (map && props.featureSelected) {

      // @ts-ignore
      map.flyTo({
        center: [Number(props.featureSelected.longitude), Number(props.featureSelected.latitude)],
        zoom: 17
      })
    }
  }, [map, props.featureSelected])

  return (
    <>
      <div className={props.className} ref={mapContainer} data-navigation-control="on" data-gesture-handling="off"></div>
    </>
  );
}

export default Component;
