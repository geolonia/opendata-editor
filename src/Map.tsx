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
    setEditMode: Function;
    selectedRowId: string | null;
    setSelectedRowId: Function;
    fitBounds: boolean;
    setFitBounds: Function;
}

const Component = (props: Props) => {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const [simpleStyle, setSimpleStyle] = React.useState<any>();
  const [map, setMap] = React.useState<any>();
  const [draggableMarker, setDraggableMarker] = React.useState<any>(null);

  const editMode = props.editMode;
  const setEditMode = props.setEditMode;
  const selectedRowId = props.selectedRowId;
  const setSelectedRowId = props.setSelectedRowId;
  const features = props.features;
  const setFeatures = props.setFeatures;
  const fitBounds = props.fitBounds;
  const setFitBounds = props.setFitBounds;

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
        const simpleStyle: any = new window.geolonia.simpleStyle(geojson, {id: sourceId}).addTo(map);
        setSimpleStyle(simpleStyle)
      });

      map.on('click', 'custom-geojson-circle-points', (e: any) => {
        const id = e.features[0].properties['id'];
        setEditMode(false);
        setSelectedRowId(id);
      });
    }
  }, [mapContainer, map, setEditMode, setSelectedRowId])

  React.useEffect(() => {
    if (simpleStyle) {
      const string = Papa.unparse(features);
      const geojson = csv2geojson(string);

      if (fitBounds) {
        simpleStyle.updateData(geojson).fitBounds();
        setFitBounds(false);
      } else {
        simpleStyle.updateData(geojson)
      }
    }
  }, [simpleStyle, features, fitBounds, setFitBounds])

  React.useEffect(() => {
    if (map && selectedRowId !== null) {
      const selectedFeature = features.find((feature) => feature.id === selectedRowId);

      let center = map.getCenter();
      if (selectedFeature?.longitude && selectedFeature?.latitude) {
        center = [Number(selectedFeature.longitude), Number(selectedFeature.latitude)];
      }

      if (draggableMarker) {
        draggableMarker.remove();
      }

      if (editMode) {
        const marker = new window.geolonia.Marker({ draggable: true }).setLngLat(center).addTo(map);
        setDraggableMarker(marker);

        marker.on('dragend', () => {
          const feature = features.find((feature) => feature['id'] === selectedRowId);
          const lngLat = marker.getLngLat();

          // 新規データ追加の場合
          if (!feature) {
            const latField = document.querySelector(`tr#table-data-${selectedRowId} td.latitude input`) as HTMLInputElement;
            const lngField = document.querySelector(`tr#table-data-${selectedRowId} td.longitude input`) as HTMLInputElement;

            if (latField && lngField) {
              latField.value = lngLat.lat.toString()
              lngField.value = lngLat.lng.toString()
            }
            return;
          }

          // 既存データ編集の場合
          if (!window.confirm(`「${feature?.name}」の位置情報を変更しても良いですか?`)) {
            setEditMode(false);
            marker.remove();
            return;
          }

          feature.longitude = lngLat.lng.toString();
          feature.latitude = lngLat.lat.toString();
          setFeatures([...features]);
          setEditMode(false);
          marker.remove();
        });
      }

      map.flyTo({
        center: center,
        zoom: 17
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, editMode, selectedRowId, setEditMode, features, setFeatures])

  return (
    <>
      <div className={props.className} ref={mapContainer} data-navigation-control="on" data-gesture-handling="off"></div>
    </>
  );
}

export default Component;
