import { useCallback, useEffect, useLayoutEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { GeoloniaMap } from '@geolonia/embed-react';
import { rows2geojson } from './utils/csv2geojson';
import type { Map } from '@geolonia/embed';
import type { LngLatLike } from 'maplibre-gl';

interface Feature {
  [key: string]: string;
}

interface Props {
  className?: string; // Required to apply styles by styled-components
  features: Feature[];
  setFeatures: Dispatch<SetStateAction<Feature[]>>;
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  selectedRowId: string | null;
  setSelectedRowId: Dispatch<SetStateAction<string | null>>;
  setFitBounds: Dispatch<SetStateAction<boolean>>;
  selectedOn: string | null;
  setSelectedOn: Dispatch<SetStateAction<string | null>>;
}

const Component = (props: Props) => {
  const map = useRef<Map | null>(null);
  const [simpleStyle, setSimpleStyle] = useState<any>();

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

  const onGeoloniaMapLoad = useCallback(() => {
    const sourceId = 'custom-geojson';
    const geojson = {
      type: 'FeatureCollection',
      features: [],
    } as GeoJSON.FeatureCollection;
    const simpleStyle = new window.geolonia.SimpleStyle(geojson, {id: sourceId}).addTo(map.current);
    setSimpleStyle(simpleStyle);
  }, []);

  useLayoutEffect(() => {
    const mapCurrent = map.current;
    const onClick = (e: any) => {
      const id = e.features[0].properties['id'];
      setEditMode(false);
      setSelectedRowId(id);
      setSelectedOn('map');
    };

    mapCurrent?.on('click', 'custom-geojson-circle-points', onClick);

    return () => {
      mapCurrent?.off('click', 'custom-geojson-circle-points', onClick);
    };
  }, [setEditMode, setSelectedOn, setSelectedRowId]);

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

    if (!map.current || selectedRowId === null) {
      return;
    }

    const selectedFeature = features.find((feature) => feature.id === selectedRowId);

    let center: LngLatLike = map.current.getCenter();

    const mapLayer = map.current.getLayer('selected-point');
    if (typeof mapLayer !== 'undefined') {
      map.current.removeLayer('selected-point').removeSource('selected-point');
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

    if (editMode) {
      draggableMarker = new window.geolonia.Marker({ draggable: true }).setLngLat(center).addTo(map.current);

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

    return () => {
      if (draggableMarker) {
        draggableMarker.remove();
      }
    };
  }, [map, selectedRowId, editMode, setEditMode, features, setFeatures, selectedOn]);

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
    </>
  );
};

export default Component;
