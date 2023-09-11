import { useCallback, useEffect, useLayoutEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import styled from 'styled-components';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Button from './Button';
import { dedupe, getLatLngColumnNames } from './utils/utils';
import { rows2geojson } from './utils/csv2geojson';
import type { Map, Marker } from '@geolonia/embed'; // Required to declare types of window.geolonia
import type { LngLatLike } from 'maplibre-gl';
import type { Cell } from './types';

interface Feature {
  [key: string]: string;
}

const StyledButton = styled(Button)`
  position: absolute;
  top: 385px;
  right: 35px;
`;

interface Props {
  className?: string; // Required to apply styles by styled-components
  features: Feature[];
  selectedCell: Cell;
  selectedRowIds: ReadonlySet<string>;
  readonly onMapPinSelected: (id: string) => void;
  readonly onMapPinAdded: (latitude: number, longtitude: number) => void;
  onMapPinMoved: (rowId: string, newLatitude: number, newLongitude: number) => void;
  setFitBounds: Dispatch<SetStateAction<boolean>>;
  selectedOn: string | null;
  setSelectedOn: Dispatch<SetStateAction<string | null>>;
}

const Component = (props: Props) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [simpleStyle, setSimpleStyle] = useState<any>();
  const [map, setMap] = useState<Map>();

  const {
    features,
    selectedCell,
    selectedRowIds,
    onMapPinSelected,
    onMapPinAdded,
    onMapPinMoved,
    setFitBounds,
    selectedOn,
    setSelectedOn,
  } = props;

  const addRow = useCallback(() => {
    const { lat, lng } = map?.getCenter() ?? {};

    map?.jumpTo({
      center: { lat: lat ?? 0, lng: lng ?? 0 },
      zoom: 17,
    });
    onMapPinAdded(lat ?? 0, lng ?? 0);
  }, [ map, onMapPinAdded ]);

  useLayoutEffect(() => {
    if (!mapContainer.current) {
      return;
    }
    if ((mapContainer.current as any).__initialized === true) {
      return;
    }

    const map: Map = new window.geolonia.Map({
      container: mapContainer.current,
      // @ts-ignore @geolonia/embed should allow `style` property, while it disallows it currently. (it is a bug.)
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
      const simpleStyle = new window.geolonia.SimpleStyle(geojson, {id: sourceId}).addTo(map);
      setSimpleStyle(simpleStyle);
    });

    map.on('click', 'custom-geojson-circle-points', (e: any) => {
      const id = e.features[0].properties['id'];
      onMapPinSelected(id);
      setSelectedOn('map');
    });
  }, [onMapPinSelected, setSelectedOn]);

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
    let draggableMarker: Marker;

    if (!map || (selectedRowIds.size <= 0 && !selectedCell.rowId)) {
      return;
    }

    const focusedRowIds = selectedCell.rowId ?
      dedupe([ selectedCell.rowId, ...selectedRowIds ]) :
      dedupe([ ...selectedRowIds ]);

    for (const focusedRowId of focusedRowIds) {
      const selectedFeature = features.find((feature) => feature.id === focusedRowId);

      let center: LngLatLike = map.getCenter();

      const mapLayer = map.getLayer('selected-point');
      if (typeof mapLayer !== 'undefined') {
        map.removeLayer('selected-point').removeSource('selected-point');
      }

      // 既存データ編集の場合
      if (selectedFeature) {
        const { latColumnName, lngColumnName } = getLatLngColumnNames(selectedFeature);

        if (lngColumnName && latColumnName) {
          center = [Number(selectedFeature[lngColumnName]), Number(selectedFeature[latColumnName])];

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
          onMapPinAdded(lngLat.lat, lngLat.lng);
        } else {
          // 既存データ編集の場合
          if (!window.confirm(`「${feature?.name}」の位置情報を変更しても良いですか?`)) {
            return;
          }

          onMapPinMoved(focusedRowId, lngLat.lat, lngLat.lng);
        }
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
  }, [map, selectedRowIds, features, selectedCell.rowId, simpleStyle, selectedOn, onMapPinAdded, onMapPinMoved]);

  return (
    <>
      <div
        className={props.className}
        ref={mapContainer}
        data-navigation-control="on"
        data-gesture-handling="off"
      ></div>
      <StyledButton icon={faPlusCircle} onClick={addRow}>
        データを追加
      </StyledButton>
    </>
  );
};

export default Component;
