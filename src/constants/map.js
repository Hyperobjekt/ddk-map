export const ROUTE_SET = [
  'view', // View type, 'explorer' or 'embed'
  'shapetype', // To determine active choropleth, 'census', 'state' 'county' or 'zip'
  'metric', // Active metric/indicator.
  'lat', // Latitude
  'lng', // Longitude
  'zoom', // Zoom level
]

// Default metric used by the map.
export const DEFAULT_METRIC = 'default_metric' // TODO: update default here.
// Default shape type for the map choropleths will be census tract.
export const DEFAULT_SHAPE = 'census'

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

export const DEFAULT_ROUTE =
  '/explorer/census/default/40.74/-73.96/8/'

export const BOUNDS = {
  lat: {
    max: 33.75, // 33.26625,
    min: 31.5, // 32.486597,
  },
  lng: {
    min: -98, // -97.222586,
    max: -95.5, // -96.410091,
  },
}

export const DEFAULT_VIEWPORT = {
  latitude: 39, // TODO: Update default lat and lng for nation map.
  longitude: -96,
  zoom: 3.95,
  maxZoom: 14,
  minZoom: 3.5,
  bearing: 0,
  pitch: 0,
  dragPan: true,
  touchZoom: true,
  touchRotate: true,
  preserveDrawingBuffer: true,
  height: '100%',
  width: '100%',
}
