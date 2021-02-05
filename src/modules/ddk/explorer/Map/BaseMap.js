import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import ReactMapGL, {
  NavigationControl,
  Popup,
} from 'react-map-gl'
import Mapbox, {
  useMapStore,
  useMapViewport,
} from '@hyperobjekt/mapbox'
import { fromJS } from 'immutable'
import shallow from 'zustand/shallow'

import Legend from './../Legend'
import useStore from './../store'
import theme from './../theme'
import {
  DEFAULT_VIEWPORT,
  CENTER_TRACKED_SHAPES,
} from './../../../../constants/map'
import { defaultMapStyle } from './utils/selectors'
import { getLayers } from './utils/layers'
import { getSources } from './utils/sources'
import { useDebounce, usePrevious } from './../utils'
import {
  getFeaturesAtPoint,
  getMouseXY,
} from './utils/utils'

const BaseMap = ({ ...props }) => {
  // Values from store.
  const {
    activeView,
    dataVersion,
    loadYears,
    activeYear,
    activePointLayers,
    activeMetric,
    activeNorm,
    activeShape,
    mapSources,
    setStoreValues,
    centerMetro,
    centerState,
    allDataLoaded,
    hoveredTract,
  } = useStore(
    state => ({
      activeView: state.activeView,
      dataVersion: state.dataVersion,
      loadYears: state.loadYears,
      activeYear: state.activeYear,
      activePointLayers: state.activePointLayers,
      activeMetric: state.activeMetric,
      activeNorm: state.activeNorm,
      activeShape: state.activeShape,
      mapSources: state.mapSources,
      setStoreValues: state.setStoreValues,
      centerMetro: state.centerMetro,
      centerState: state.centerState,
      allDataLoaded: state.allDataLoaded,
      hoveredTract: state.hoveredTract,
    }),
    shallow,
  )

  // Token and viewport passed to the map.
  const token = process.env.MAPBOX_API_TOKEN

  const [loaded, setLoaded] = useState(false)

  const mapRef = useRef(null)
  const [localMapRef, setLocalMapRef] = useState(null)
  useEffect(() => {
    if (mapRef.current) {
      // gives you access to StaticMap methods from ReactMapGL
      // https://visgl.github.io/react-map-gl/docs/api-reference/static-map#methods
      const map = mapRef.current.getMap()
      // do something with the map
      setLocalMapRef(map)
    }
  }, [mapRef.current])

  // storing previous hover / selected IDs
  const prev = usePrevious({
    hoveredTract,
    centerMetro,
    centerState,
    activeShape,
  })

  const styles = makeStyles(theme => ({
    parent: {
      position: 'absolute',
      left:
        activeView === 'embed'
          ? 0
          : theme.extras.controlPanel.width,
      height:
        activeView === 'embed'
          ? '100vh'
          : `calc(100vh - ${theme.mixins.toolbar['@media (min-width:0px) and (orientation: landscape)'].minHeight}px)`,
      width:
        activeView === 'embed'
          ? '100vw'
          : `calc(100vw - ${theme.extras.controlPanel.width})`,
      top:
        activeView === 'embed'
          ? 0
          : `${theme.mixins.toolbar['@media (min-width:0px) and (orientation: landscape)'].minHeight}px`,
      [theme.breakpoints.up('md')]: {
        height:
          activeView === 'embed'
            ? '100vh'
            : `calc(100vh - ${theme.mixins.toolbar['@media (min-width:600px)'].minHeight}px)`,
        top:
          activeView === 'embed'
            ? 0
            : `${theme.mixins.toolbar['@media (min-width:600px)'].minHeight}px`,
      },
      root: {},
    },
    navControls: {
      position: 'absolute',
      right: '16px',
      top: '50%',
    },
    customAttrib: {
      position: 'absolute',
      left: '100px',
      bottom: '6px',
    },
    customAttribTxt: {
      marginLeft: '0.3rem',
    },
  }))

  const classes = styles()

  const handleClick = feature => {
    // console.log('Map click, ', e)
    if (
      !!feature &&
      !!feature.layer &&
      feature.layer['source-layer'] === 'tracts'
    ) {
      // If the hovered item is new, reset.
      if (feature.id !== prev.activeShape) {
        // Set states for both.
        localMapRef.setFeatureState(
          {
            id: prev.activeShape,
            source: 'ddkids_tracts',
            sourceLayer: 'tracts',
          },
          { active: false },
        )
      }
      localMapRef.setFeatureState(
        {
          id: feature.id,
          source: 'ddkids_tracts',
          sourceLayer: 'tracts',
        },
        { active: true },
      )
      setStoreValues({
        activeShape: feature.id,
      })
    }
  }

  const handleHover = feature => {
    // console.log('Map hover, ', feature)
    if (
      !!feature &&
      !!feature.layer &&
      feature.layer['source-layer'] === 'tracts'
    ) {
      // console.log('feature exists, setting')
      // If the hovered item is new, reset.
      if (feature.id !== prev.hoveredTract) {
        // Set states for both.
        localMapRef.setFeatureState(
          {
            id: prev.hoveredTract,
            source: 'ddkids_tracts',
            sourceLayer: 'tracts',
          },
          { hovered: false },
        )
        localMapRef.setFeatureState(
          {
            id: feature.id,
            source: 'ddkids_tracts',
            sourceLayer: 'tracts',
          },
          { hovered: true },
        )
        // Set previous hovered
        setStoreValues({
          hoveredTract: feature.id,
          hoveredFeature: feature,
        })
      }
    }
  }

  const handleMouseMove = e => {
    // console.log('mousemove, ', e)
    setStoreValues({
      mouseXY: e.point,
      coords: e.lngLat,
    })
  }

  const handleLoad = () => {
    // console.log('Map loaded.')
    setLoaded(true)
  }

  const getMapSources = () => {
    const sources = getSources(
      process.env.MAPBOX_USER,
      process.env.MAPBOX_API_TOKEN,
      dataVersion,
      loadYears,
    )
    setStoreValues({ mapSources: sources })
    return sources
  }

  const debouncedHoveredTract = useDebounce(
    hoveredTract,
    500,
  )
  /** memoized array of shape and point layers */
  const layers = useMemo(() => {
    if (!loaded || !activeMetric || !activeNorm) {
      return []
    }
    const context = {
      activeYear,
      activeMetric,
      activeNorm,
      activePointLayers,
      centerState,
    }
    // console.log('layers changed, ', hoveredTract)
    return getLayers(getMapSources(), context)
  }, [
    loaded,
    activeYear,
    activeMetric,
    activeNorm,
    activePointLayers,
    centerState,
  ])

  /**
   * Returns the map style with the provided layers inserted
   * @param {Map} style immutable Map of the base mapboxgl style
   * @param {array} layers list of layer objects containing style and z order
   */
  const getUpdatedMapStyle = (
    style,
    layers,
    sources = fromJS({}),
  ) => {
    const updatedSources = style
      .get('sources')
      .merge(sources)
    const updatedLayers = layers.reduce(
      (newLayers, layer) =>
        newLayers.splice(layer.z, 0, layer.style),
      style.get('layers'),
    )
    return style
      .set('sources', updatedSources)
      .set('layers', updatedLayers)
  }

  // update map style layers when layers change
  const mapStyle = useMemo(
    () =>
      getUpdatedMapStyle(
        defaultMapStyle,
        layers,
        !!mapSources ? mapSources : getMapSources(),
      ),
    [defaultMapStyle, layers],
  )

  const viewport = useStore(state => state.viewport)
  const setViewport = useStore(state => state.setViewport)
  // handler for viewport change, debounced to prevent
  // race errors
  const resetViewportState = useCallback(
    (vp, options = {}) => {
      // console.log('resetViewportState, vp = ', vp)
      // console.log('BOUNDS, ', BOUNDS)
      if (!loaded) return
      setViewport(vp)
    },
    [setViewport, loaded],
  )

  // These are for updating our own app state (for hash management).
  const mapViewport = useMapViewport()
  // Update our viewport data in state store when viewport chagnes.
  // useEffect(() => {
  //   // console.log('mapViewport changed,', mapViewport)
  //   resetViewportState(mapViewport[0])
  // }, [mapViewport])

  const debouncedMapViewport = useDebounce(mapViewport, 300)
  useEffect(() => {
    // console.log('debouncedMapViewport changed')
    resetViewportState(mapViewport[0])
  }, [debouncedMapViewport])

  // Update highlighted shapes when viewport changes or on load.
  useEffect(() => {
    // console.log(
    //   'loaded or mapViewport changed,',
    //   mapViewport,
    // )
    // Update center tract, metro, and state
    if (!!localMapRef && !!mapSources && !!loaded) {
      // console.log('local map ref exists')
      // Get point at map center
      const mapEl = document.getElementById('map')
      const mapCenterX = mapEl.offsetWidth / 2
      const mapCenterY = mapEl.offsetHeight / 2
      // Find all features at a point
      const layersArray = CENTER_TRACKED_SHAPES.map(
        layer => {
          return `${layer.id}Shapes`
        },
      )
      var features = localMapRef.queryRenderedFeatures(
        [mapCenterX, mapCenterY],
        {
          layers: layersArray,
        },
      )
      // console.log('Features at map center: ', features)
      const centerSettingsObj = {}
      CENTER_TRACKED_SHAPES.forEach((el, i) => {
        const singular = el.id.slice(0, -1)
        const capitalized = singular.length
          ? singular[0].toUpperCase() +
            singular.slice(1).toLowerCase()
          : ''
        // If zoom is higher than relevant to shape,
        // we won't make it highlighted.
        let feature = features.find(feature => {
          return feature.layer.id === `${el.id}Shapes`
        })
        // console.log('feature is ', feature)
        // If feature exists, also check any required prop values.
        el.require_props.forEach(prop => {
          // console.log('checking a prop: ', prop)
          if (
            !!feature &&
            !!feature.properties &&
            feature.properties[prop[0]] !== prop[1]
          ) {
            feature = false
          }
        })
        if (
          // mapViewport[0].zoom >= el.minZoom &&
          !!feature &&
          !!feature.id &&
          !!feature.properties
        ) {
          if (!!feature) {
            if (feature.id !== prev[el.storeHandle]) {
              // console.log(`Setting centered for ${el.id}.`)
              if (!!prev[el.storeHandle]) {
                localMapRef.setFeatureState(
                  {
                    id: prev[el.storeHandle],
                    source: el.source,
                    sourceLayer: el.id,
                  },
                  { centered: false },
                )
              }
              localMapRef.setFeatureState(
                {
                  id: feature.id,
                  source: feature.layer.source,
                  sourceLayer:
                    feature.layer['source-layer'],
                },
                { centered: true },
              )
            }
          }
          centerSettingsObj[
            `center${capitalized}`
          ] = !!feature ? feature.id : 0
        } else {
          if (!!prev[el.storeHandle]) {
            localMapRef.setFeatureState(
              {
                id: prev[el.storeHandle],
                source: el.source,
                sourceLayer: el.id,
              },
              { centered: false },
            )
          }
          centerSettingsObj[`center${capitalized}`] = 0
        }
      })
      setStoreValues(centerSettingsObj)
    }
  }, [loaded, allDataLoaded, debouncedMapViewport])

  // This is from the mapbox component.
  const setMapViewport = useMapStore(
    state => state.setViewport,
  )
  // This is to update the map component state.
  const handleViewportChange = vp => {
    setMapViewport(vp)
  }

  // Passed through to the MapGL component.
  const mapProps = {
    mapboxApiAccessToken: token,
    minZoom: DEFAULT_VIEWPORT.minZoom,
    maxZoom: DEFAULT_VIEWPORT.maxZoom,
    mapStyle: mapStyle,
    onMouseMove: handleMouseMove,
  }

  return (
    <div className={clsx(classes.parent)}>
      <Mapbox
        ref={mapRef}
        defaultViewport={{ ...DEFAULT_VIEWPORT }}
        MapGLProps={mapProps}
        style={{ width: '100%', height: '100%' }}
        onClick={handleClick}
        onHover={handleHover}
        onLoad={handleLoad}
        maxBounds={DEFAULT_VIEWPORT.maxBounds}
      >
        {
          <>
            <Legend />
            <div
              className={clsx(
                'custom-attribution',
                classes.customAttrib,
              )}
            >
              <span className="divider">|</span>
              <Typography
                variant="caption"
                className={clsx(classes.customAttribTxt)}
              >
                {i18n.translate(`MAP_UI_POWERED_BY`)}
              </Typography>
            </div>
            <div className={clsx(classes.navControls)}>
              {activeView === 'explorer' && (
                <>
                  <NavigationControl
                    showCompass={false}
                    onViewportChange={viewport => {
                      handleViewportChange(viewport)
                    }}
                    captureClick={true}
                  ></NavigationControl>
                </>
              )}
            </div>
          </>
        }
      </Mapbox>
    </div>
  )
}

BaseMap.propTypes = {}

BaseMap.defaultProps = {}

export default BaseMap
