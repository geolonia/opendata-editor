import Papa from 'papaparse';

const latColumns = [ '緯度', 'lat', 'latitude', '緯度（10進法）', '緯度(10進法)'] as const;
const lngColumns = [ '経度', 'lng', 'longitude', '経度（10進法）', '経度(10進法)' ] as const;
const titleColumns = [ '名称', '名前', 'タイトル', 'title', 'name' ] as const;

export type Row = { [key: string]: string };

export function csv2rows(csv: string) {
  return Papa.parse<Row>(csv, {
    header: true,
    skipEmptyLines: true,
  }).data;
}

export function csv2geojson(csv: string) {
  const data = csv2rows(csv);
  return rows2geojson(data);
}

export function rows2geojson(data: Row[]) {
  let latColumn = 'latitude';
  let lngColumn = 'longitude';
  let titleColumn = 'title';

  for (let i = 0; i < latColumns.length; i++) {
    if (data.length && data[0] && data[0][latColumns[i]]) {
      latColumn = latColumns[i];
    }
  }

  for (let i = 0; i < lngColumns.length; i++) {
    if (data.length && data[0] && data[0][lngColumns[i]]) {
      lngColumn = lngColumns[i];
    }
  }

  for (let i = 0; i < titleColumns.length; i++) {
    if (data.length && data[0] && data[0][titleColumns[i]]) {
      titleColumn = titleColumns[i];
    }
  }

  const geojson = {
    type: 'FeatureCollection',
    features: [],
  } as GeoJSON.FeatureCollection;

  for (let i = 0; i < data.length; i++) {
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [],
      },
      properties: {},
    } as GeoJSON.Feature;

    if (data[i]) {
      let coordinates = [];

      if (data[i]['location']) {
        const [latitude, longitude] = data[i]['location'].split(',');
        coordinates = [Number(longitude), Number(latitude)];
      } else {
        coordinates = [Number(data[i][lngColumn]), Number(data[i][latColumn])];
      }

      feature.geometry = {
        type: 'Point',
        coordinates: coordinates,
      };

      data[i]['title'] = data[i][titleColumn];

      feature.properties = data[i];

      geojson.features.push(feature);
    }
  }

  return geojson;
}
