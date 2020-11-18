import create from 'zustand'
import i18n from '@pureartisan/simple-i18n'
import { FlyToInterpolator } from 'react-map-gl'
import WebMercatorViewport from 'viewport-mercator-project'
import * as ease from 'd3-ease'

// import en_US from './../../../constants/lang'
import {
  DEFAULT_VIEWPORT,
  DEFAULT_ROUTE,
  DEFAULT_METRIC,
  DEFAULT_SHAPE,
} from './../../../constants/map'

const useStore = create((set, get) => ({
  // Set any store values by passing in an object of values to merge.
  setStoreValues: obj => set({ ...obj }),
  // Track loading of remote data files.
  allDataLoaded: false,
  // Percent loaded for remote data files.
  dataLoadedPercent: 0,
  // Error flag for loading failure.
  dataLoaderFailed: false,
  // General path to all s3 folders in bucket.
  // Where the whole path would look about like so:
  // https://untd-test.s3.us-east-2.amazonaws.com/development/schools.json
  s3Path: 'https://untd-map.s3.us-east-2.amazonaws.com/',
  remoteJson: {},
  setRemoteJson: json =>
    set(state => ({
      remoteJson: { ...state.remoteJson, ...json },
    })),
  // Default route.
  defaultRoute: DEFAULT_ROUTE,
  activeLang: `en_us`,
  langSet: {},
  activeView: `explorer`, // View type, explorer or embed
  activeShape: `census`,
  defaultShape: DEFAULT_SHAPE,
  activeMetric: `default_metric`,
  defaultMetric: DEFAULT_METRIC,
  viewport: {
    latitude: 39, // TODO: Update default lat and lng for nation map.
    longitude: -96,
    zoom: 3.95,
    bearing: 0,
    pitch: 0,
    dragPan: true,
    touchZoom: true,
    touchRotate: true,
    preserveDrawingBuffer: true,
  },
  resetViewport: DEFAULT_VIEWPORT,
  setViewport: viewport =>
    set(state => ({
      viewport: { ...state.viewport, ...viewport },
    })),
  flyToReset: () => {
    set(state => ({
      viewport: {
        ...state.resetViewport,
        transitionDuration: 3000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: ease.easeCubic,
      },
    }))
  },
  flyToSchool: (lat, lng) => {
    // console.log('fly to school, ', lat)
    const newViewport = {
      latitude: lat,
      longitude: lng,
      zoom: 14,
    }
    set(state => ({
      viewport: {
        ...state.viewport,
        ...newViewport,
        transitionDuration: 3000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: ease.easeCubic,
      },
    }))
  },
  slideoutPanel: {
    active: false,
    panel: '', // 'filters', 'layers', or 'info'
  },
  defaultFilterTab: 'cri',
  activeFilterTab: 'cri',
  shareLinkModal: false,
  unifiedShareModal: false,
  handleToggleMenu: null,
  shareHash: null,
  breakpoint: null,
  browserWidth: null,
  flyToSchoolSLN: null,
  schoolHint: null,
  showIntroModal: false,
  showPanelModal: false,
  enableTour: true, // Set this true to show the launch tour button in intro modal.
  showMapModal: false,
  // Hovered feature ID
  hovered: null,
  // Hovered feature type.
  type: null,
  // Hovered feature object.
  feature: null,
  // x, y coords of hovered object.
  coords: [0, 0],
  setCoords: coords => set({ coords }),
  // Sets the various state items related to school hover.
  setHovered: (
    hoveredId,
    hoveredType,
    coords,
    feature,
    options = { showTooltip: true, showMarkers: true },
  ) => {
    // console.log(
    //   'setHovered',
    //   hoveredId,
    //   hoveredType,
    //   coords,
    // )
    set(state => ({
      hovered: hoveredId,
      type: hoveredType,
      coords: coords ? coords : state.coords,
      feature: feature,
    }))
  },
  // Position of tooltips in control panel, changes with breakpoint
  buttonTooltipPosition: 'auto',
  showMobileLegend: false,
  interactionsMobile: false,
  runTour: false,
  tourStepIndex: 0,
  // Set up for tour to run.
  setUpTour: () => {
    set(state => ({
      // Return view to map.
      activeView: 'explorer',
      // Reset metric.
      activeMetric: state.defaultMetric,
      // Reset quintiles.
      activeQuintiles: [1, 1, 1, 1, 1],
      // Close the panel.
      slideoutPanel: {
        active: false,
        panel: '',
      },
      // Active tab in slideout panel.
      activeFilterTab: state.defaultFilterTab,
      // Close modal if displayed.
      showPanelModal: false,
      // Return tour to 0.
      tourStepIndex: 0,
      // Run the tour.
      runTour: true,
    }))
  },
  // Do not track events before map is loaded, as these
  // are state settings based on hash and not user interactions.
  doTrackEvents: false,
  // Counters for events that don't have clear state indicators.
  eventShareTwitter: 0,
  eventShareFacebook: 0,
  eventShareEmail: 0,
  eventShareLink: 0,
  eventMapReset: 0,
  eventMapCapture: 0,
  eventSchoolSearch: 0,
  eventSchoolPage: 0,
  eventLaunchTour: 0,
  eventCloseTour: 0,
  eventCloseTourStep: null,
  incrementLaunchTour: () => {
    set(state => ({
      eventLaunchTour: state.eventLaunchTour + 1,
    }))
  },
  incrementCloseTour: () => {
    set(state => ({
      eventCloseTour: state.eventCloseTour + 1,
      eventCloseTourStep: state.tourStepIndex,
    }))
  },
  // Not counters.
  eventError: 0,
}))
const api = useStore

export default useStore
