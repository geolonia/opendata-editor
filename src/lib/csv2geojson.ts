import Papa from 'papaparse';

const latColumns = [ '緯度', 'lat', 'latitude' ]
const lngColumns = [ '経度', 'lng', 'longitude' ]
const titleColumns = [ '名称', '名前', 'タイトル', 'title', 'name' ]

export function csv2geojson(csv: string) {
  const data = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
  }).data;

  let latColumn = 'latitude'
  let lngColumn = 'longitude'
  let titleColumn = 'title'

  for (let i = 0; i < latColumns.length; i++) {
    // @ts-ignore
    if (data.length && data[0] && data[0][latColumns[i]]) {
      latColumn = latColumns[i]
    }
  }

  for (let i = 0; i < lngColumns.length; i++) {
    // @ts-ignore
    if (data.length && data[0] && data[0][lngColumns[i]]) {
      lngColumn = lngColumns[i]
    }
  }

  for (let i = 0; i < titleColumns.length; i++) {
    // @ts-ignore
    if (data.length && data[0] && data[0][titleColumns[i]]) {
      titleColumn = titleColumns[i]
    }
  }

  const geojson = {
    "type": "FeatureCollection",
    "features": []
  } as GeoJSON.FeatureCollection

  for (let i = 0; i < data.length; i++) {
    const feature = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": []
      },
      "properties": {}
    } as GeoJSON.Feature

    if (data[i]) {
      let coordinates = [];
      
      // @ts-ignore
      if (data[i]['location']) {
        // @ts-ignore
        const [latitude, longitude] = data[i]['location'].split(',')
        coordinates = [Number(longitude), Number(latitude)]
      } else {
        // @ts-ignore
        coordinates = [Number(data[i][lngColumn]), Number(data[i][latColumn])]
      }

      feature.geometry = {
        type: "Point",
        coordinates: coordinates
      }

      // @ts-ignore
      data[i]['title'] = data[i][titleColumn]

      // @ts-ignore
      feature.properties = data[i]

      geojson.features.push(feature)
    }
  }

  return geojson
}
