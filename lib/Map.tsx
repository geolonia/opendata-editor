import React from 'react';

import { rows2geojson } from './utils/csv2geojson';

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
  setFeatures: React.Dispatch<React.SetStateAction<Feature[]>>;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRowId: string | null;
  setSelectedRowId: React.Dispatch<React.SetStateAction<string | null>>;
  setFitBounds: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOn: string | null;
  setSelectedOn: React.Dispatch<React.SetStateAction<string | null>>;
}

const Component = (props: Props) => {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const [simpleStyle, setSimpleStyle] = React.useState<any>();
  const [map, setMap] = React.useState<any>();

  const {
    editMode,
    setEditMode,
    selectedRowId,
    setSelectedRowId,
    features,
    setFeatures,
    setFitBounds,
    selectedOn,
    setSelectedOn,
  } = props;

  React.useLayoutEffect(() => {
    if ((mapContainer.current as any).__initialized === true) {
      return;
    }

    const map = new window.geolonia.Map({
      container: mapContainer.current,
      style: 'geolonia/gsi',
      hash: true,
    });

    (mapContainer.current as any).__initialized = true;
    setMap(map);

    map.on('load', () => {
      const sourceId = 'custom-geojson';
      const geojson = {
        type: 'FeatureCollection',
        features: [],
      } as GeoJSON.FeatureCollection;
      const simpleStyle: any = new window.geolonia.simpleStyle(geojson, {id: sourceId}).addTo(map);
      setSimpleStyle(simpleStyle);
    });

    map.on('click', 'custom-geojson-circle-points', (e: any) => {
      const id = e.features[0].properties['id'];
      setEditMode(false);
      setSelectedRowId(id);
      setSelectedOn('map');
    });
  }, [mapContainer, setEditMode, setSelectedRowId, setSelectedOn]);

  React.useEffect(() => {
    if (!simpleStyle) { return; }

    const geojson = rows2geojson(features);

    setFitBounds((fitBounds) => {
      if (fitBounds) {
        simpleStyle.updateData(geojson).fitBounds({duration: 0});
        return false;
      } else {
        simpleStyle.updateData(geojson);
        return fitBounds;
      }
    });
  }, [simpleStyle, features, setFitBounds]);

  React.useEffect(() => {
    let draggableMarker: any = null;
    const latColumns = [ '緯度', 'lat', 'latitude', '緯度（10進法）', '緯度(10進法)'] as const;
    const lngColumns = [ '経度', 'lng', 'longitude', '経度（10進法）', '経度(10進法)' ] as const;

    if (!map || selectedRowId === null) {
      return;
    }

    const selectedFeature = features.find((feature) => feature.id === selectedRowId);

    let center = map.getCenter();

    const mapLayer = map.getLayer('selected-point');
    if (typeof mapLayer !== 'undefined') {
      map.removeLayer('selected-point').removeSource('selected-point');
    }

    // 既存データ編集の場合
    if (selectedFeature) {

      let latColumn = 'latitude';
      let lngColumn = 'longitude';
      for (let i = 0; i < latColumns.length; i++) {
        if (Object.keys(selectedFeature).includes(latColumns[i])) {
          latColumn = latColumns[i];
        }
      }
      for (let i = 0; i < lngColumns.length; i++) {
        if (Object.keys(selectedFeature).includes(lngColumns[i])) {
          lngColumn = lngColumns[i];
        }
      }

      if (selectedFeature[lngColumn] && selectedFeature[latColumn]) {
        center = [Number(selectedFeature[lngColumn]), Number(selectedFeature[latColumn])];

        // 選択されたポイントをハイライトする。
        map.addSource('selected-point', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: center,
            },
          },
        });
        map.addLayer({
          id: 'selected-point',
          type: 'circle',
          source: 'selected-point',
          layout: {},
          paint: {
            'circle-radius': 21,
            'circle-color': '#ff0000',
            'circle-opacity': 0.5,
            'circle-blur': 0.5,
          },
        });
        map.moveLayer('selected-point', 'custom-geojson-circle-points');
      }
    }

    if (editMode) {
      draggableMarker = new window.geolonia.Marker({ draggable: true }).setLngLat(center).addTo(map);

      draggableMarker.on('dragend', () => {
        const feature = features.find((feature) => feature['id'] === selectedRowId);
        const lngLat = draggableMarker.getLngLat();

        // 新規データ追加の場合
        if (!feature) {
          const latField = document.querySelector(`tr#table-data-${selectedRowId} td.latitude input`) as HTMLInputElement;
          const lngField = document.querySelector(`tr#table-data-${selectedRowId} td.longitude input`) as HTMLInputElement;

          if (latField && lngField) {
            latField.value = lngLat.lat.toString();
            lngField.value = lngLat.lng.toString();
          }
          return;
        }

        // 既存データ編集の場合
        if (!window.confirm(`「${feature?.name}」の位置情報を変更しても良いですか?`)) {
          setEditMode(false);
          return;
        }

        feature.longitude = lngLat.lng.toString();
        feature.latitude = lngLat.lat.toString();
        setFeatures([...features]);
        setEditMode(false);
      });
    }

    if (selectedOn === 'map') {
      map.flyTo({
        center: center,
        speed: 3,
      });
    } else {
      map.jumpTo({
        center: center,
        speed: 3,
        zoom: 17,
      });
    }

    return () => {
      if (draggableMarker) {
        draggableMarker.remove();
      }
    };
  }, [map, selectedRowId, editMode, setEditMode, features, setFeatures, selectedOn]);

  return (
    <>
      <div
        className={props.className}
        ref={mapContainer}
        data-navigation-control="on"
        data-gesture-handling="off"
      ></div>
    </>
  );
};

export default Component;
