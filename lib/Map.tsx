import { useEffect, useLayoutEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { dedupe } from './utils/utils';
import { rows2geojson } from './utils/csv2geojson';
import type { Cell } from './types';

declare global {
  interface Window {
    geolonia: any;
  }
}

interface Feature {
  [key: string]: string;
}

interface Props {
  className?: string; // Required to apply styles by styled-components
  features: Feature[];
  setFeatures: Dispatch<SetStateAction<Feature[]>>;
  selectedCell: Cell;
  selectedRowIds: ReadonlySet<string>;
  readonly onMapPinSelected: (id: string) => void;
  setFitBounds: Dispatch<SetStateAction<boolean>>;
  selectedOn: string | null;
  setSelectedOn: Dispatch<SetStateAction<string | null>>;
}

const Component = (props: Props) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [simpleStyle, setSimpleStyle] = useState<any>();
  const [map, setMap] = useState<any>();

  const {
    features,
    setFeatures,
    selectedCell,
    selectedRowIds,
    onMapPinSelected,
    setFitBounds,
    selectedOn,
    setSelectedOn,
  } = props;

  useLayoutEffect(() => {
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
      onMapPinSelected(id);
      setSelectedOn('map');
    });
  }, [mapContainer, onMapPinSelected, setSelectedOn]);

  useEffect(() => {
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

  useEffect(() => {
    let draggableMarker: any = null;
    const latColumns = [ '緯度', 'lat', 'latitude', '緯度（10進法）', '緯度(10進法)'] as const;
    const lngColumns = [ '経度', 'lng', 'longitude', '経度（10進法）', '経度(10進法)' ] as const;

    if (!map || (selectedRowIds.size <= 0 && !selectedCell.rowId)) {
      return;
    }

    const focusedRowIds = selectedCell.rowId ?
      dedupe([ selectedCell.rowId, ...selectedRowIds ]) :
      dedupe([ ...selectedRowIds ]);

    for (const focusedRowId of focusedRowIds) {
      const selectedFeature = features.find((feature) => feature.id === focusedRowId);

      let center = map.getCenter();

      const mapLayer = map.getLayer('selected-point');
      if (typeof mapLayer !== 'undefined') {
        map.removeLayer('selected-point').removeSource('selected-point');
      }

      // 既存データ編集の場合
      if (selectedFeature) {
        const selectedFeatureKeys = Object.keys(selectedFeature);
        let latColumn = 'latitude';
        let lngColumn = 'longitude';

        for (let i = 0; i < latColumns.length; i++) {
          if (selectedFeatureKeys.includes(latColumns[i])) {
            latColumn = latColumns[i];
          }
        }
        for (let i = 0; i < lngColumns.length; i++) {
          if (selectedFeatureKeys.includes(lngColumns[i])) {
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

      draggableMarker = new window.geolonia.Marker({ draggable: true }).setLngLat(center).addTo(map);

      draggableMarker.on('dragend', () => {
        const feature = features.find((feature) => feature['id'] === focusedRowId);
        const lngLat = draggableMarker.getLngLat();

        // 新規データ追加の場合
        if (!feature) {
          const latField = document.querySelector(`tr#table-data-${focusedRowId} td.latitude input`) as HTMLInputElement;
          const lngField = document.querySelector(`tr#table-data-${focusedRowId} td.longitude input`) as HTMLInputElement;

          if (latField && lngField) {
            latField.value = lngLat.lat.toString();
            lngField.value = lngLat.lng.toString();
          }
          return;
        }

        // 既存データ編集の場合
        if (!window.confirm(`「${feature?.name}」の位置情報を変更しても良いですか?`)) {
          return;
        }

        feature.longitude = lngLat.lng.toString();
        feature.latitude = lngLat.lat.toString();
        setFeatures([...features]);
      });

      if (focusedRowIds.length > 1) {
        const geojson = rows2geojson(features.filter((feature) => focusedRowIds.includes(feature.id)));
        simpleStyle.updateData(geojson).fitBounds({ duration: 0 });
      } else {
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
      }

      return () => {
        if (draggableMarker) {
          draggableMarker.remove();
        }
      };
    }
  }, [map, selectedRowIds, features, setFeatures, selectedCell.rowId, simpleStyle, selectedOn]);

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
