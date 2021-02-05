import create from 'zustand'
import i18n from '@pureartisan/simple-i18n'
import { FlyToInterpolator } from 'react-map-gl'
import WebMercatorViewport from 'viewport-mercator-project'
import * as ease from 'd3-ease'
import merge from 'deepmerge'

import { langSet } from './../../../constants/lang'

import {
  DEFAULT_VIEWPORT,
  DEFAULT_ROUTE,
  DEFAULT_VIEW,
  DEFAULT_ACTIVE_SHAPE,
  DEFAULT_ACTIVE_YEAR,
  DEFAULT_LOAD_YEARS,
  DEFAULT_ACTIVE_POINTS,
  DEFAULT_METRIC,
  DEFAULT_NORM,
  DEFAULT_DATA_VERSION,
  DEFAULT_LAT,
  DEFAULT_LNG,
  DEFAULT_ZOOM,
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
  // JSON files loaded from remote.
  remoteJson: {},
  setRemoteJson: json =>
    set(state => ({
      remoteJson: { ...state.remoteJson, ...json },
    })),
  // Language packs handling.
  // Active language
  activeLang: `en_US`,
  // Counter for lang pack updates.
  langUpdates: 0,
  incrementLangUpdates: () => {
    set(state => ({
      langUpdates: state.langUpdates + 1,
    }))
  },
  // Languages store.
  langs: {
    en_US: langSet.en_US,
  },
  // Get a language.
  getLang: loc => {
    return get().langs[loc]
  },
  // Set languages.
  setLang: (loc, lang) => {
    // console.log('setLang')
    const newLangs = get().langs
    // console.log('newLangs, ', newLangs)
    newLangs[loc] = merge(newLangs[loc], lang)
    set({ langs: newLangs })
    // console.log('after set: ', get().langs)
  },
  // Routing.
  activeView: DEFAULT_VIEW,
  activeShape: DEFAULT_ACTIVE_SHAPE,
  activeYear: DEFAULT_ACTIVE_YEAR,
  activePointLayers: DEFAULT_ACTIVE_POINTS,
  // Which years of tilesets to load.
  loadYears: DEFAULT_LOAD_YEARS,
  activeMetric: DEFAULT_METRIC,
  activeNorm: DEFAULT_NORM,
  // Version of data to load, can be passed in from hash.
  dataVersion: DEFAULT_DATA_VERSION,
  // Flag to trigger download of data dependent upon hash.
  initialStateSetFromHash: false,
  // Map sources, stored so we don't have to construct it over and over.
  mapSources: false,
  // Map center tract, metro, and state tracking
  centerTract: 0,
  centerMetro: 0,
  centerState: 0,
  // Hovered tract.
  hoveredTract: 0,
  // Previously hovered tract.
  prevHoveredTract: 0,
  // Hovered feature.
  hoveredFeature: null,
  // Mouse XY.
  mouseXY: [0, 0],
  // Mouse coords.
  coords: [0, 0],
  setCoords: coords => set({ coords }),
  // Settings pertaining to viewport state.
  viewport: DEFAULT_VIEWPORT,
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
  shareEmbedModal: false,
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
      activeMetric: DEFAULT_METRIC,
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
  isTouchScreen: false,
  // Do not track events before map is loaded, as these
  // are state settings based on hash and not user interactions.
  doTrackEvents: false,
  // Counters for events that don't have clear state indicators.
  eventShareTwitter: 0,
  eventShareFacebook: 0,
  eventShareEmail: 0,
  eventShareLink: 0,
  eventShareEmbed: 0,
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
