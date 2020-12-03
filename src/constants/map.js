export const ROUTE_VIEW = 'view' // View type, 'explorer' or 'embed'
export const ROUTE_SHAPE = 'shapetype' // currently just census
export const ROUTE_YEAR = 'year' // 2010 or 2015
export const ROUTE_METRO = 'metroarea' // in msaid15 format, blank if no metro location is zoomed
export const ROUTE_METRIC = 'metric' // child opportunity score (coi) vs opportunity level (ol)
export const ROUTE_NORM = 'normlevel' // whether data is normalized by metro (m) or nation (n)
export const ROUTE_TILESET = 'tilesetversion'
export const ROUTE_LAT = 'lat' // Latitude
export const ROUTE_LNG = 'lng' // Longitude
export const ROUTE_ZOOM = 'zoom' // Zoom level

export const ROUTE_SET = [
  ROUTE_VIEW,
  ROUTE_SHAPE,
  ROUTE_YEAR,
  ROUTE_METRO,
  ROUTE_METRIC,
  ROUTE_NORM,
  ROUTE_TILESET,
  ROUTE_LAT,
  ROUTE_LNG,
  ROUTE_ZOOM,
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

// NOTE: include '' iff empty route value is acceptable
export const OPTIONS_VIEW = ['explorer', 'embed']
export const OPTIONS_SHAPE = ['census']
export const OPTIONS_YEAR = ['2015', '2010']
export const OPTIONS_METRO = [''] // TODO
export const OPTIONS_METRIC = ['coi', 'ol']
export const OPTIONS_NORM = ['n', 'm']
export const OPTIONS_TILESET = ['1.0.0']

export const OPTIONS_MAP = {
  [ROUTE_VIEW]: OPTIONS_VIEW,
  [ROUTE_SHAPE]: OPTIONS_SHAPE,
  [ROUTE_YEAR]: OPTIONS_YEAR,
  [ROUTE_METRO]: OPTIONS_METRO,
  [ROUTE_METRIC]: OPTIONS_METRIC,
  [ROUTE_NORM]: OPTIONS_NORM,
  [ROUTE_TILESET]: OPTIONS_TILESET,
}

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
