#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync');
const { v4: uuidv4 } = require('uuid');

const ZOOM = 18

function lon2tile(lon, zoom) {
  lon = Number(lon);
  zoom = Number(zoom);
  return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
}
const lat2tile = (lat, zoom) => {
  lat = Number(lat);
  zoom = Number(zoom);
  return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
}

const lonlat2tile = (lon, lat, zoom) => {
  const x = lon2tile(lon, zoom)
  const y = lat2tile(lat, zoom)
  return { x, y }
}

const tile2lon = (x, zoom) => {
  x = Number(x);
  zoom = Number(zoom);
  return (x / Math.pow(2, zoom) * 360 - 180);
}
const tile2lat = (y, zoom) => {
  y = Number(y);
  zoom = Number(zoom);
  var n = Math.PI - 2 * Math.PI * y / Math.pow(2, zoom);
  return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
}

const tile2lonlat = (x, y, zoom) => {
  const lon = tile2lon(x, zoom)
  const lat = tile2lat(y, zoom)
  return { lon, lat }
}

async function exportGeoJSON() {

  const file = fs.readFileSync(path.join(__dirname, 'osaka_city_food_business_20211231.csv'), 'utf8')
  const data = parse(file);
  const features = []

  for (let i = 0; i < data.length; i++) {

    const item = data[i];

    if (item[24] === '新規') {

      const lon = item[12]
      const lat = item[11]

      const tile = lonlat2tile(lon, lat, ZOOM)
      const expirationYear = String(item[21].slice(0, 4))
      const address = item[9]

      const NW = tile2lonlat(tile.x, tile.y, ZOOM);
      const SE = tile2lonlat(tile.x + 1, tile.y + 1, ZOOM);

      const isSameTile = features.findIndex(feature => {
        return feature && feature.properties.tile.x === tile.x && feature.properties.tile.y === tile.y;
      });

      if (isSameTile > - 1) {

        const prevExpirationYear = features[isSameTile].properties[expirationYear] || 0;

        features[isSameTile].properties[expirationYear] = prevExpirationYear + 1;
        features[isSameTile].properties.shopList.push({
          name: item[4],
          expYear: expirationYear,
          address: address,
        })

      } else {

        features.push({
          "id": uuidv4(),
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [NW.lon, NW.lat],
                [NW.lon, SE.lat],
                [SE.lon, SE.lat],
                [SE.lon, NW.lat],
                [NW.lon, NW.lat],
              ]
            ]
          },
          "properties": {
            [expirationYear]: 1, // 許可満了年
            "区分": item[24], // 区分
            tile: tile, // tileIndex,
            shopList: [
              {
                name: item[4],
                expYear: expirationYear,
                address: address,
              }
            ] // 店舗名
          }
        })
      }
    }
  }

  const geoJSON = {
    "type": "FeatureCollection",
    "features": features,
  }

  console.log(features.length)

  fs.writeFileSync(path.join(__dirname, 'osaka_city_food_biz.geojson'), JSON.stringify(geoJSON, null, 2))

}

exportGeoJSON()


