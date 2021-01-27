export const ROUTE_VIEW = 'activeView' // View type, 'explorer' or 'embed'
export const ROUTE_ACTIVE_SHAPE = 'activeShape' // ID of active shape on map (tract)
export const ROUTE_ACTIVE_YEAR = 'activeYear' // 2010 or 2015
export const ROUTE_LOAD_YEARS = 'loadYears' // Comma-delineated list of years of data to load.
export const ROUTE_ACTIVE_POINTS = 'activePointLayers' // Comma-delineated list of active dot density layers
export const ROUTE_METRIC = 'activeMetric' // child opportunity score (coi) vs opportunity level (ol)
export const ROUTE_NORM = 'activeNorm' // whether data is normalized by metro (m) or nation (n) or state (s)
export const ROUTE_DATA_VERSION = 'dataVersion'
export const ROUTE_LAT = 'lat' // Latitude
export const ROUTE_LNG = 'lng' // Longitude
export const ROUTE_ZOOM = 'zoom' // Zoom level

export const ROUTE_SET = [
  ROUTE_VIEW,
  ROUTE_ACTIVE_SHAPE,
  ROUTE_ACTIVE_YEAR,
  ROUTE_LOAD_YEARS,
  ROUTE_ACTIVE_POINTS,
  ROUTE_METRIC,
  ROUTE_NORM,
  ROUTE_DATA_VERSION,
  ROUTE_LAT,
  ROUTE_LNG,
  ROUTE_ZOOM,
]

export const DEFAULT_VIEW = 'explorer'
export const DEFAULT_ACTIVE_SHAPE = ''
export const DEFAULT_ACTIVE_YEAR = '2015'
export const DEFAULT_LOAD_YEARS = ['2010', '2015']
export const DEFAULT_ACTIVE_POINTS = ''
export const DEFAULT_METRIC = 'xc5c'
export const DEFAULT_NORM = 'n'
export const DEFAULT_DATA_VERSION = '1.0.4'
export const DEFAULT_LAT = '37.39'
export const DEFAULT_LNG = '-96.78'
export const DEFAULT_ZOOM = '3.15'

// #/explorer//2015/2010,2015//coi/1.0.4/1.0.4/37.39/-96.78/3.15/
export const DEFAULT_ROUTE = `#/${DEFAULT_VIEW}/${DEFAULT_ACTIVE_SHAPE}/${DEFAULT_ACTIVE_YEAR}/${DEFAULT_LOAD_YEARS}/${DEFAULT_ACTIVE_POINTS}/${DEFAULT_METRIC}/${DEFAULT_NORM}/${DEFAULT_DATA_VERSION}/${DEFAULT_LAT}/${DEFAULT_LNG}/${DEFAULT_ZOOM}`

// NOTE: include '' if empty route value is acceptable
export const OPTIONS_VIEW = {
  options: ['explorer', 'embed'],
  validate: 'one_exact_match', // Provided value must exactly match one of these.
}
export const OPTIONS_ACTIVE_SHAPE = {
  options: '',
  validate: 'type_number', // Any number.
}
export const OPTIONS_ACTIVE_YEAR = {
  options: ['2015', '2010'],
  validate: 'one_exact_match',
}
export const OPTIONS_LOAD_YEARS = {
  options: ['2010', '2015', '2020'], // NOTE: Including 2020 because client will add that data later this year, but don't pass it in for now.
  validate: 'contains_only',
}
export const OPTIONS_ACTIVE_POINTS = {
  options: ['ai', 'ap', 'hi', 'b', 'w'],
  validate: 'contains_only',
}
// xc5 indicates that the value is an index. c5 is a client artifact
// that ddk-etl preserves bc it **may** be meaningful.
// x is an affix ddk-etl adds to all indices.
// Trailing letter specifies whether it's an overall index or sub-index.
// 'ed': 'e', ==> education
// 'he': 'h', ==> health
// 'se': 'o', ==> economic
// 'coi': 'c', ==> overall
export const OPTIONS_METRIC = {
  options: ['xc5o', 'xc5h', 'xc5e', 'xc5c'],
  validate: 'one_exact_match',
}
export const OPTIONS_NORM = {
  options: ['n', 'm', 's'],
  validate: 'one_exact_match',
}
export const OPTIONS_DATA_VERSION = {
  options: /^([0-9]+).([0-9]+).([0-9]+)?$/g,
  validate: 'regex', // Create a regex with the supplied option and validate against that.
}

export const OPTIONS_MAP = {
  [ROUTE_VIEW]: OPTIONS_VIEW,
  [ROUTE_ACTIVE_SHAPE]: OPTIONS_ACTIVE_SHAPE,
  [ROUTE_ACTIVE_YEAR]: OPTIONS_ACTIVE_YEAR,
  [ROUTE_LOAD_YEARS]: OPTIONS_LOAD_YEARS,
  [ROUTE_ACTIVE_POINTS]: OPTIONS_ACTIVE_POINTS,
  [ROUTE_METRIC]: OPTIONS_METRIC,
  [ROUTE_NORM]: OPTIONS_NORM,
  [ROUTE_DATA_VERSION]: OPTIONS_DATA_VERSION,
}

// Demographics for dot density.
export const OPTIONS_DEMOGRAPHICS = [
  'ai',
  'ap',
  'h',
  'b',
  'w',
]

// Data files to load from remote.
export const DATA_FILES = [
  {
    id: 'metros',
    filename: 'metros',
    ext: 'json',
    type: 'data',
  },
  {
    id: 'tracts-all',
    filename: 'tracts-all-data',
    ext: 'csv',
    type: 'data',
  },
  {
    id: 'barcharts',
    filename: 'barcharts/barcharts',
    ext: 'json',
    type: 'data',
  },
  {
    id: 'indicators',
    filename: 'helpers/indicators',
    ext: 'json',
    type: 'data',
  },
  {
    id: 'en_US',
    filename: 'helpers/en_US',
    ext: 'json',
    type: 'dict',
  },
]

export const DEFAULT_VIEWPORT = {
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
    // [-107.6, 33.8], // southwest.
    [-176, 33.8], // southwest.
    // [-65, 49.9], // northeast.
    [-75, 70], // northeast.
  ],
}
