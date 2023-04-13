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
    setFeatures: Function;
    editMode: boolean;
    selectedRowId: string | null;
    setSelectedRowId: Function;
    setEditMode: Function;
}

const Component = (props: Props) => {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const [simpleStyle, setSimpleStyle] = React.useState();
  const [map, setMap] = React.useState();
  const [draggableMarker, setDraggableMarker] = React.useState(null);

  React.useEffect(() => {
    if (!map) {
      const map = new window.geolonia.Map({
        container: mapContainer.current,
        style: "geolonia/gsi",
        hash: true,
      });

      setMap(map);

      map.on("load", () => {
        const sourceId = 'custom-geojson'
        const geojson = {
          "type": "FeatureCollection",
          "features": []
        } as GeoJSON.FeatureCollection
        const simpleStyle = new window.geolonia.simpleStyle(geojson, {id: sourceId}).addTo(map).fitBounds();
        setSimpleStyle(simpleStyle)
      });

      map.on('click', 'custom-geojson-circle-points', (e: any) => {
        const id = e.features[0].properties['id'];
        props.setEditMode(false);
        props.setSelectedRowId(id);
      });
    }
  }, [mapContainer, props.features, props, map])

  React.useEffect(() => {
    if (simpleStyle) {
      const string = Papa.unparse(props.features);
      const geojson = csv2geojson(string);

      // @ts-ignore
      simpleStyle.updateData(geojson).fitBounds();
    }
  }, [simpleStyle, props.features])

  React.useEffect(() => {
    if (map && props.selectedRowId !== null) {
      const selectedFeature = props.features.find((feature) => feature.id === props.selectedRowId);

      // @ts-ignore
      let center = map.getCenter();
      if (selectedFeature?.longitude && selectedFeature?.latitude) {
        center = [Number(selectedFeature.longitude), Number(selectedFeature.latitude)];
      }

      if (draggableMarker) {
        // @ts-ignore
        draggableMarker.remove();
      }

      if (props.editMode) {
        const marker = new window.geolonia.Marker({ draggable: true }).setLngLat(center).addTo(map);
        setDraggableMarker(marker);

        marker.on('dragend', () => {
          const lngLat = marker.getLngLat();

          const features = props.features
          const feature = features.find((feature) => feature['id'] === props.selectedRowId);
          
          // 新規データ追加の場合
          if (!feature) {
            const latField = document.querySelector(`tr#table-data-${props.selectedRowId} td:nth-child(3) input`);
            const lngField = document.querySelector(`tr#table-data-${props.selectedRowId} td:nth-child(4) input`);

            if (latField && lngField) {
              //@ts-ignore
              latField.value = lngLat.lat.toString()
              //@ts-ignore
              lngField.value = lngLat.lng.toString()
            }
            return;
          } 
          
          // 既存データ編集の場合
          feature.longitude = lngLat.lng.toString();
          feature.latitude = lngLat.lat.toString();
          props.setFeatures([...features]);
          props.setEditMode(false);
          marker.remove();
        });
      }

      //@ts-ignore
      map.flyTo({
        center: center,
        zoom: 17
      })
    }
  }, [map, props.editMode, props.selectedRowId])

  return (
    <>
      <div className={props.className} ref={mapContainer} data-navigation-control="on" data-gesture-handling="off"></div>
    </>
  );
}

export default Component;
