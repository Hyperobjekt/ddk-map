export const ROUTE_VIEW = 'activeView' // View type, 'explorer' or 'embed'
export const ROUTE_ACTIVE_SHAPE = 'activeShape' // ID of active (clicked) shape on map (tract)
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
export const DEFAULT_ACTIVE_SHAPE = 0
export const DEFAULT_ACTIVE_YEAR = '15'
export const DEFAULT_LOAD_YEARS = ['10', '15']
export const DEFAULT_ACTIVE_POINTS = ''
export const DEFAULT_METRIC = 'xc'
export const DEFAULT_NORM = 'n'
export const DEFAULT_DATA_VERSION = '1.0.5'
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
  options: ['15', '10'],
  validate: 'one_exact_match',
}
export const OPTIONS_LOAD_YEARS = {
  options: ['10', '15', '20'], // NOTE: Including 2020 because client will add that data later this year, but don't pass it in for now.
  validate: 'contains_only',
}
// Point feature options.
// Order here goes from highest z-index to lowest (least populous to most).
export const OPTIONS_ACTIVE_POINTS = {
  options: ['ai', 'ap', 'b', 'hi', 'w'],
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
  options: ['xo', 'xh', 'xe', 'xc'],
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

// Data files to load from remote.
export const DATA_FILES = [
  {
    id: 'metros',
    filename: 'metros',
    ext: 'json',
    type: 'data',
  },
  {
    id: 'tracts',
    filename: 'tracts-sm',
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
    [-176, 13.8], // southwest.
    // [-65, 49.9], // northeast.
    [-55, 80], // northeast.
  ],
}

const DEFAULT_POINT_SIZE = 5

export const POINT_TYPES = [
  { id: 'ai', color: '#FF66CC', size: 10 },
  { id: 'ap', color: '#FF730C', size: DEFAULT_POINT_SIZE },
  { id: 'hi', color: '#7401B1', size: DEFAULT_POINT_SIZE },
  { id: 'b', color: '#FFC31A', size: DEFAULT_POINT_SIZE },
  { id: 'w', color: '#66CC00', size: DEFAULT_POINT_SIZE },
]

export const SHAPE_ZOOM_LEVELS = [
  { id: 'tracts', minZoom: 6 },
  { id: 'metros', minZoom: 3 },
  { id: 'states', minZoom: 3 },
]

// Shape types we track for map center.
// require_props is an array of arrays,
// first value = prop name
// second value = expected value
export const CENTER_TRACKED_SHAPES = [
  {
    id: 'metros',
    minZoom: 3,
    require_props: [['in100', 1]],
    storeHandle: `centerMetro`,
    source: `ddkids_shapes`,
  },
  {
    id: 'states',
    minZoom: 3,
    require_props: [],
    storeHandle: `centerState`,
    source: `ddkids_shapes`,
  },
]

export const CHOROPLETH_COLORS = [
  '#C9E8F8',
  '#8DD4F9',
  '#73A0C9',
  '#588DA8',
  '#56778D',
]
