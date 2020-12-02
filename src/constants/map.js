export const ROUTE_SET = [
  'view', // View type, 'explorer' or 'embed'
  'shapetype', // currently just census
  'year', // 2010 or 2015
  'metroarea', // in msaid15 format, blank if no metro location is zoomed
  'metric', // child opportunity score (coi) vs opportunity level (ol)
  'normlevel', // whether data is normalized by metro (m) or nation (n)
  'tilesetversion',
  'lat', // Latitude
  'lng', // Longitude
  'zoom', // Zoom level
]

export const DEFAULT_VIEW = 'explorer'
export const DEFAULT_SHAPE = 'census'
export const DEFAULT_YEAR = '2015'
export const DEFAULT_METRO = ''
export const DEFAULT_METRIC = 'coi'
export const DEFAULT_NORM = 'n'
export const DEFAULT_TILESET = '1.0.0'
export const DEFAULT_LAT = '37.39'
export const DEFAULT_LNG = '-96.78'
export const DEFAULT_ZOOM = '3.15'

export const DEFAULT_ROUTE = `/${DEFAULT_VIEW}/${DEFAULT_SHAPE}/${DEFAULT_YEAR}/${DEFAULT_METRO}/${DEFAULT_METRIC}/${DEFAULT_NORM}/${DEFAULT_TILESET}/${DEFAULT_LAT}/${DEFAULT_LNG}/${DEFAULT_ZOOM}`

// Data files to load from remote.
export const DATA_FILES = [
  // {
  //   id: 'counties',
  //   filename: 'sm_counties',
  //   ext: 'geojson',
  // },
  // {
  //   id: 'places',
  //   filename: 'sm_places',
  //   ext: 'geojson',
  // },
  // {
  //   id: 'tracts',
  //   filename: 'sm_tracts',
  //   ext: 'geojson',
  // },
  // {
  //   id: 'zips',
  //   filename: 'sm_zcta',
  //   ext: 'geojson',
  // },
  // {
  //   id: 'points',
  //   filename: 'points',
  //   ext: 'geojson',
  // },
]

export const DEFAULT_VIEWPORT = {
  // TODO: Update default lat and lng for nation map.
  latitude: Number(DEFAULT_LAT),
  longitude: Number(DEFAULT_LNG),
  zoom: Number(DEFAULT_ZOOM),
  maxZoom: 14,
  minZoom: 3,
  bearing: 0,
  pitch: 0,
  dragPan: true,
  touchZoom: true,
  touchRotate: true,
  preserveDrawingBuffer: true,
  height: '100%',
  width: '100%',
  maxBounds: [
    [-107.6, 33.8],
    [-65, 49.9],
  ],
}
