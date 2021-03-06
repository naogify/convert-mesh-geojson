# convert-mesh-geojson

[大阪市の食品営業許可施設一覧データ](https://www.city.osaka.lg.jp/contents/wdu290/opendata/#cat-all_data-00000382)の施設を、許可満了年で126mメッシュごとに集計し、メッシュ上の GeoJSON を作成するスクリプトです。

下の様な形式の GeoJSON を作成します。

`properties` の4桁の数のキーと値は、許可満了年とその施設件数です。例： `"2025": 1` は、その範囲に 許可満了日が2025年の施設が一件あったことを表します。

```
{
  "type": "FeatureCollection",
  "features": [
    {
      "id": "362af72b-7199-4a5f-bb67-b6898aa95189",
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              135.50537109375,
              34.70549341022546
            ],
            [
              135.50537109375,
              34.704364434458476
            ],
            [
              135.50674438476562,
              34.704364434458476
            ],
            [
              135.50674438476562,
              34.70549341022546
            ],
            [
              135.50537109375,
              34.70549341022546
            ]
          ]
        ]
      },
      "properties": {
        "2025": 1,
        "2026": 1,
        "2027": 2,
        "区分": "新規",
        "tile": {
          "x": 229744,
          "y": 104096
        },
        "shopList": [
          {
            "name": "ドトールコーヒーショップ　北野病院店",
            "expYear": "2027",
            "address": "北区扇町２丁目４番２０号"
          },
          {
            "name": "（株）ニチダン　北野病院店",
            "expYear": "2027",
            "address": "北区扇町２丁目４番２０号"
          },
          {
            "name": "ドトールコーヒーショップ　北野病院店",
            "expYear": "2025",
            "address": "北区扇町２丁目４番２０号"
          },
          {
            "name": "北野病院　新棟１階",
            "expYear": "2026",
            "address": "北区扇町２丁目４番２０号"
          }
        ]
      }
    }
   ]
  }
```


## 使い方

```
npm install
npm run build
```

`osaka_city_food_biz.geojson` という GeoJSON ファイルが生成されます。
