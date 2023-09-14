import { useCallback, useEffect, useLayoutEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import styled from 'styled-components';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Button from './Button';
import { dedupe, getLatLngColumnNames } from './utils/utils';
import { rows2geojson } from './utils/csv2geojson';
import { GeoloniaMap } from '@geolonia/embed-react';
import type geolonia from '@geolonia/embed';
import type { Map, Marker } from '@geolonia/embed';
import type { LngLatLike } from 'maplibre-gl';
import type { Cell, Feature } from './types';

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
  const map = useRef<geolonia.Map | null>(null);
  const [simpleStyle, setSimpleStyle] = useState<any>();

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
    const { lat, lng } = map.current?.getCenter() ?? {};

    map.current?.jumpTo({
      center: { lat: lat ?? 0, lng: lng ?? 0 },
      zoom: 17,
    });
    onMapPinAdded(lat ?? 0, lng ?? 0);
  }, [ map, onMapPinAdded ]);

  const onGeoloniaMapLoad = useCallback(() => {
    const sourceId = 'custom-geojson';
    const geojson = {
      type: 'FeatureCollection',
      features: [],
    } as GeoJSON.FeatureCollection;
    const simpleStyle = new window.geolonia.SimpleStyle(geojson, {id: sourceId}).addTo(map.current);
    setSimpleStyle(simpleStyle);
  }, []);

  useEffect(() => {
    const onClick = (e: any) => {
      const id = e.features[0].properties['id'];
      onMapPinSelected(id);
      setSelectedOn('map');
    };

    map.current?.on('click', 'custom-geojson-circle-points', onClick);

    return () => {
      map.current?.off('click', 'custom-geojson-circle-points', onClick);
    };
  }, [map, onMapPinSelected, setSelectedOn]);

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

    if (!map.current || (selectedRowIds.size <= 0 && !selectedCell.rowId)) {
      return;
    }

    const { latColumnName, lngColumnName } = getLatLngColumnNames(features);
    const focusedRowIds = selectedCell.rowId ?
      dedupe([ selectedCell.rowId, ...selectedRowIds ]) :
      dedupe([ ...selectedRowIds ]);

    for (const focusedRowId of focusedRowIds) {
      const selectedFeature = features.find((feature) => feature.id === focusedRowId);

      let center: LngLatLike = map.current.getCenter();

      const mapLayer = map.current.getLayer('selected-point');
      if (typeof mapLayer !== 'undefined') {
        map.current.removeLayer('selected-point').removeSource('selected-point');
      }

      // 既存データ編集の場合
      if (selectedFeature) {
        if (lngColumnName && latColumnName) {
          center = [Number(selectedFeature[lngColumnName]), Number(selectedFeature[latColumnName])];

          // 選択されたポイントをハイライトする。
          map.current.addSource('selected-point', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: center,
              },
            },
          });
          map.current.addLayer({
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
          map.current.moveLayer('selected-point', 'custom-geojson-circle-points');
        }
      }

      if (focusedRowIds.length > 1) {
        const geojson = rows2geojson(features.filter((feature) => focusedRowIds.includes(feature.id)));
        simpleStyle.updateData(geojson).fitBounds({ duration: 0 });
      } else {
        if (selectedOn === 'map') {
          map.current.flyTo({
            center: center,
            speed: 3,
          });
        } else {
          map.current.jumpTo({
            center: center,
            zoom: 17,
          });
        }
      }
    }

    if (lngColumnName && latColumnName) {
      const feature = features[selectedCell.rowIdx];
      const featureLngLat: LngLatLike = {
        lng: Number(feature[lngColumnName]),
        lat: Number(feature[latColumnName]),
      };

      draggableMarker = new window.geolonia.Marker({ draggable: true }).setLngLat(featureLngLat).addTo(map.current);

      draggableMarker.on('dragend', () => {
        if (!selectedCell.rowId) {
          throw new Error('Attempt to drag a map marker but the corresponding cell is not selected.');
        }

        const lngLat = draggableMarker.getLngLat();

        // 新規データ追加の場合
        if (!feature) {
          onMapPinAdded(lngLat.lat, lngLat.lng);
        } else {
          // 既存データ編集の場合
          if (!window.confirm(`「${feature?.name}」の位置情報を変更しても良いですか?`)) {
            draggableMarker.setLngLat(featureLngLat);
            return;
          }

          onMapPinMoved(selectedCell.rowId, lngLat.lat, lngLat.lng);
        }
      });
    }

    return () => {
      if (draggableMarker) {
        draggableMarker.remove();
      }
    };
  }, [map, selectedRowIds, features, selectedCell.rowId, selectedCell.rowIdx, simpleStyle, selectedOn, onMapPinAdded, onMapPinMoved]);

  return (
    <>
      <GeoloniaMap
        className={props.className}
        mapStyle='geolonia/gsi'
        hash='on'
        navigationControl="on"
        gestureHandling="off"
        onLoad={onGeoloniaMapLoad}
        mapRef={map}
      />
      <StyledButton icon={faPlusCircle} onClick={addRow}>
        データを追加
      </StyledButton>
    </>
  );
};

export default Component;
