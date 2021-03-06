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
import { NavigationControl } from 'react-map-gl'
import Mapbox, {
  useMapStore,
  useMapViewport,
  useFlyToBounds,
  useFlyToFeature,
  useFlyToLatLon,
  useFlyToReset,
  useFlyToState,
} from '@hyperobjekt/mapbox'
import { fromJS, set } from 'immutable'
import shallow from 'zustand/shallow'
import { isMobile } from 'react-device-detect'

import useStore from './../store'
import { theme } from './../theme'
import {
  DEFAULT_VIEWPORT,
  CENTER_TRACKED_SHAPES,
  MAP_CONTROLS_CLASSES,
  FULL_FUNCT_ZOOM_THRESHOLD,
} from './../../../../constants/map'
import { defaultMapStyle } from './utils/selectors'
import { getLayers } from './utils/layers'
import { getSources } from './utils/sources'
import { useDebounce, usePrevious } from './../utils'
import MapPopup from './components/MapPopup'
import MoreControlsContainer from './components/MoreControlsContainer'
import { getIsControl, getParents } from './../utils'

const useStyles = makeStyles(theme => ({
  parent: {
    position: 'absolute',
    left: 0,
    height: `calc(100vh - ${theme.mixins.toolbar['@media (min-width:0px) and (orientation: landscape)'].minHeight}px)`,
    width: '100vw',
    top: `${theme.mixins.toolbar['@media (min-width:0px) and (orientation: landscape)'].minHeight}px`,
    [theme.breakpoints.up('md')]: {
      height: `calc(100vh - ${theme.mixins.toolbar['@media (min-width:600px)'].minHeight}px)`,
      top: `${theme.mixins.toolbar['@media (min-width:600px)'].minHeight}px`,
      left: `${theme.extras.controlPanel.width}px`,
      width: `calc(100vw - ${theme.extras.controlPanel.width}px)`,
    },
  },
  embed: {
    height: `100vh`,
    top: 0,
    [theme.breakpoints.up('md')]: {
      height: `100vh`,
      top: 0,
      left: 0,
      width: `100vw`,
    },
  },
  navControls: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
    position: 'absolute',
    right: '16px',
    bottom: '16px',
    '& .mapboxgl-ctrl.mapboxgl-ctrl-group': {
      borderRadius: 0,
      '& .mapboxgl-ctrl-icon': {
        width: '18px',
        height: '18px',
        margin: 'auto',
        fontWeight: 200,
      },
      '& button.mapboxgl-ctrl-zoom-in': {
        width: '28px', // '32px',
        height: '28px', // '32px',
        '& .mapboxgl-ctrl-icon': {
          backgroundImage: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABkSURBVHgB7ZSxCoAwEENz1n/ooEP9/4+yi4MfIZHiIjrFIlK8B7cchJAjHOA0RYjDXEbR9JCwBJEOL+MG3xvYdXHU0BIewbyty3Te3BKwIhRrDxLiyDKKxlv0AwPpmxKW4TTHDu+rDrVuNRmMAAAAAElFTkSuQmCC)`,
        },
      },
      '& .mapboxgl-ctrl-zoom-out': {
        width: '28px', // '32px',
        height: '28px', // '32px',
        '& .mapboxgl-ctrl-icon': {
          backgroundImage: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAA/SURBVHgB7cyxEQAQEETRRRECCf0XRSJQhEFoXMAQ2hf+uVuAiGhLrcFYF0f2uNJSLTnMRYsTmc7nH36J6GsdzSMIBsOVRsEAAAAASUVORK5CYII=)`,
        },
      },
    },
  },
  customAttrib: {
    position: 'absolute',
    left: '100px',
    bottom: '6px',
  },
  customAttribTxt: {
    marginLeft: '0.3rem',
  },
  mobileGate: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'initial',
    },
  },
}))

const BaseMap = ({ ...props }) => {
  // Values from store.
  const {
    activeView,
    dataVersion,
    activeYear,
    activePointLayers,
    activeMetric,
    activeNorm,
    activeShape,
    setStoreValues,
    centerMetro,
    centerState,
    allDataLoaded,
    hoveredTract,
    controlHovered,
    mouseXY,
    flyToFeature,
    hoveredTractArr,
    pushHoveredTract,
    showIntroModal,
    flyToReset,
    breakpoint,
    windowInnerHeight,
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
      setStoreValues: state.setStoreValues,
      centerMetro: state.centerMetro,
      centerState: state.centerState,
      allDataLoaded: state.allDataLoaded,
      hoveredTract: state.hoveredTract,
      controlHovered: state.controlHovered,
      mouseXY: state.mouseXY,
      flyToFeature: state.flyToFeature,
      hoveredTractArr: state.hoveredTractArr,
      pushHoveredTract: state.pushHoveredTract,
      showIntroModal: state.showIntroModal,
      flyToReset: state.flyToReset,
      breakpoint: state.breakpoint,
      windowInnerHeight: state.windowInnerHeight,
    }),
    shallow,
  )

  //// SETUP

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

  const classes = useStyles()

  setStoreValues({
    flyToFeature: useFlyToFeature(),
    flyToBounds: useFlyToBounds(),
    flyToLatLon: useFlyToLatLon(),
    flyToState: useFlyToState(),
    flyToReset: useFlyToReset(),
  })

  // FUNCTIONS FOR UPDATING MAP

  const setFeatureState = (
    featureId,
    source,
    layer,
    attribute,
    value,
  ) => {
    localMapRef.setFeatureState(
      {
        id: featureId,
        source: source,
        sourceLayer: layer,
      },
      { [attribute]: value },
    )
  }

  /**
   * Clears hovered state from old hovered items (cleanup for fast mouse movement).
   */
  const resetTractHoverStates = () => {
    // console.log('resetTractHoverStates()')
    const tracts = localMapRef
      .queryRenderedFeatures({
        layers: ['tractsShapes'], // layers: ['tractsShapes', 'tractsLines'],
      })
      .filter(el => el.state.hovered === true)
    // console.log('tracts,', tracts.length, tracts)
    for (var i = 0; i < tracts.length; i++) {
      // console.log(
      //   `Removing hover state from ${tracts[i].id}`,
      // )
      setFeatureState(
        tracts[i].id,
        'ddkids_tracts',
        'tracts',
        'hovered',
        false,
      )
    }
  }

  useEffect(() => {
    // console.log(
    //   'checking hovered tract array, ',
    //   hoveredTractArr,
    // )
    if (!!loaded && hoveredTractArr.length > 30) {
      // console.log('in useeffect, ', hoveredTractArr.length)
      resetTractHoverStates()
      setStoreValues({ hoveredTractArr: [] })
    }
  }, [hoveredTractArr])

  //// INTERACTION AND EVENT HANDLERS

  // Necessary because different tilesets are loaded for different years.
  // Restore hovered state to the same tract in the selected year tileset.
  useEffect(() => {
    // console.log('activeYear changed')
    // When active year is updated,
    // Query the map for the previous active tract,
    // And restore the state
    if (!!loaded && !!activeShape) {
      setFeatureState(
        activeShape,
        'ddkids_tracts',
        'tracts',
        'active',
        true,
      )
    }
  }, [activeYear])

  const handleClick = e => {
    // console.log('Map click, ', e)
    if (activeView === 'embed') {
      return
    }
    if (controlHovered) {
      // console.log('control is hovered')
      return
    }
    // If zoomed out, don't offer the same click funct.
    if (viewport.zoom < FULL_FUNCT_ZOOM_THRESHOLD) {
      if (activeNorm === 'm') {
        // If norming is metro, click on metro area zooms to metro
        const metros = localMapRef.queryRenderedFeatures(
          mouseXY,
          {
            layers: ['metrosShapes', 'metrosLines'],
          },
        )
        if (!!metros && metros.length > 0) {
          setStoreValues({
            centerMetro: metros[0].id,
          })
          flyToFeature(metros[0])
        }
      }
    } else {
      // Zoomed in. Handling tracts.
      // console.log('after return statement')
      const tracts = localMapRef.queryRenderedFeatures(
        mouseXY,
        {
          layers: ['tractsShapes'], // layers: ['tractsShapes', 'tractsLines'],
        },
      )
      if (!!tracts && tracts.length > 0) {
        // If the clicked item is new, reset.
        if (tracts[0].id !== prev.activeShape) {
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
            id: tracts[0].id,
            source: 'ddkids_tracts',
            sourceLayer: 'tracts',
          },
          { active: true },
        )
        setStoreValues({
          activeShape: tracts[0].id,
          slideoutTract: tracts[0].id,
          slideoutFeature: tracts[0],
          slideoutPanel: {
            panel: 'tract',
            active: true,
          },
        })
      }
    }
  }

  // const handleHover = feature => {
  //   // console.log('Map hover, ', feature)
  // }

  // const handleDblClick = e => {
  //   console.log('handleDblClick, ', e)
  // }

  const handleMouseOut = e => {
    // console.log('handleMouseOut')
    if (activeView === 'embed') {
      return
    }
    // When the users mouses out of the map canvas,
    // reset the hovered tract values and feature states.
    setFeatureState(
      prev.hoveredTract,
      'ddkids_tracts',
      'tracts',
      'hovered',
      false,
    )
    setFeatureState(
      hoveredTract,
      'ddkids_tracts',
      'tracts',
      'hovered',
      false,
    )
    // Set previous hovered to null
    setStoreValues({
      hoveredTract: 0,
      hoveredFeature: null,
    })
  }

  const handleMouseMove = e => {
    if (activeView === 'embed') {
      return
    }
    let updates = {}
    // console.log('mousemove, ', e)
    // If the cursor is over the legend or another control,
    // we need to clear hovered states.
    const hoveredElements = document.querySelectorAll(
      ':hover',
    )
    const parents = []
    hoveredElements.forEach(el => {
      parents.push(getParents(el))
    })
    const parentsList = Object.values(parents)
    const nodeList = Object.values(hoveredElements)
    const isControl =
      nodeList.some(node => {
        // console.log('node, ', node, node.classList)
        return MAP_CONTROLS_CLASSES.some(item =>
          node.classList.contains(item),
        )
      }) ||
      parentsList.some(node => {
        // console.log('node, ', node, node.classList)
        return MAP_CONTROLS_CLASSES.some(
          item =>
            node &&
            node.classlist &&
            node.classList.contains(item),
        )
      })
    // if (!!isControl) {
    //   console.log('isControl, ', isControl)
    // }

    // If we have moved the mouse outside of any tracts, remove
    // the hovered state from the last tract.
    const tracts = localMapRef.queryRenderedFeatures(
      e.point,
      {
        layers: ['tractsShapes'], // layers: ['tractsShapes', 'tractsLines'],
      },
    )
    // console.log('tracts, ', tracts)
    if (!tracts || tracts.length <= 0) {
      // Remove hovered state from previously hovered.
      // console.log('removing hovered state')
      setFeatureState(
        prev.hoveredTract,
        'ddkids_tracts',
        'tracts',
        'hovered',
        false,
      )
      // Set previous hovered to null
      updates = {
        ...updates,
        hoveredTract: 0,
        hoveredFeature: null,
      }
    }
    // If hovering a control, remove currently hovered.
    if (!!isControl) {
      setFeatureState(
        prev.hoveredTract,
        'ddkids_tracts',
        'tracts',
        'hovered',
        false,
      )
      setFeatureState(
        hoveredTract,
        'ddkids_tracts',
        'tracts',
        'hovered',
        false,
      )
      // Set previous hovered to null
      setStoreValues({
        hoveredTract: 0,
        hoveredFeature: null,
      })
    }
    // If hovering a tract, and tract is different,
    // reset hovered.
    if (!!tracts && tracts.length > 0 && !isControl) {
      // console.log(
      //   'mousemove hovered tracts array: ',
      //   tracts,
      // )
      if (tracts[0].id !== prev.hoveredTract) {
        pushHoveredTract(tracts[0].id)
        // Set states for both.
        setFeatureState(
          prev.hoveredTract,
          'ddkids_tracts',
          'tracts',
          'hovered',
          false,
        )
        setFeatureState(
          tracts[0].id,
          'ddkids_tracts',
          'tracts',
          'hovered',
          true,
        )
        // Set new hovered hovered feature in store.
        updates = {
          ...updates,
          hoveredTract: tracts[0].id,
          hoveredFeature: tracts[0],
        }
      }
    }
    // Setting mouse coords and lnglat
    // for general use by tooltips, etc.
    updates = {
      ...updates,
      mouseXY: e.point,
      coords: e.lngLat,
      controlHovered: isControl,
    }
    setStoreValues(updates)
  }

  const updateCentered = () => {
    if (!!localMapRef && !!loaded) {
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
  }

  const getMapDimensions = () => {
    // console.log('getMapDimensions()')
    const map = document.getElementById('map')
    // console.log('map, ', map)
    return [map.offsetWidth, map.offsetHeight]
  }

  const handleResize = () => {
    // console.log('handleResize()')
    // Set map dimensions
    setStoreValues({
      mapSize: getMapDimensions(),
    })
  }

  const handleLoad = () => {
    // console.log('Map loaded.')
    setLoaded(true)
    document.dispatchEvent(new Event('mapDataLoaded'))
    updateCentered()
    // Put place labels on top.
    localMapRef.moveLayer('settlement-minor-label')
    localMapRef.moveLayer('settlement-major-label')
    // If initial load, reset the map to viewport.
    if (!!showIntroModal) {
      flyToReset()
    }
    // If there is an active shape inherited from the hash
    // then set the slideout tract id and feature
    setTimeout(() => {
      if (activeShape !== 0) {
        // console.log('has activeShape', localMapRef)
        localMapRef.setFeatureState(
          {
            id: activeShape,
            source: 'ddkids_tracts',
            sourceLayer: 'tracts',
          },
          { active: true },
        )
        const features = localMapRef.querySourceFeatures(
          'ddkids_tracts',
          {
            sourceLayer: 'tracts',
            filter: ['==', ['id'], activeShape],
          },
        )
        // console.log('features, ', features)
        if (features.length > 0) {
          setStoreValues({
            slideoutTract: activeShape,
            slideoutFeature: features[0],
            slideoutPanel: {
              active: true,
              panel: 'tract',
            },
          })
        }
      }
    }, 1000)
    // Set map dimensions
    setStoreValues({
      mapSize: getMapDimensions(),
    })
  }

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

  const debouncedMapViewport = useDebounce(mapViewport, 200)
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
    updateCentered()
  }, [loaded, allDataLoaded, debouncedMapViewport])

  // Hack. The map isn't checking centered features
  // when loaded. Force it to check.
  setTimeout(() => {
    updateCentered()
  }, 300)

  // This is from the mapbox component.
  const setMapViewport = useMapStore(
    state => state.setViewport,
  )
  // This is to update the map component state.
  const handleViewportChange = vp => {
    setMapViewport(vp)
  }

  const getMapSources = () => {
    const sources = getSources(
      process.env.MAPBOX_USER,
      process.env.MAPBOX_API_TOKEN,
      dataVersion,
      activeYear,
    )
    // setStoreValues({ mapSources: sources })
    return sources
  }

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
      centerMetro,
      viewport,
    }
    // console.log('layers changed, ', hoveredTract)
    return getLayers(getMapSources(), context)
  }, [
    loaded,
    activeYear,
    activeMetric,
    activeNorm,
    activePointLayers,
    // centerState,
    activeNorm === 's' ? centerState : null,
    activeNorm === 'm' ? centerMetro : null,
    viewport.zoom,
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
        getMapSources(),
      ),
    [defaultMapStyle, layers],
  )

  const height = useMemo(() => {
    return {
      height: `${
        windowInnerHeight -
        theme.mixins.toolbar[
          '@media (min-width:0px) and (orientation: landscape)'
        ].minHeight
      }px`,
    }
  }, [isMobile, breakpoint])

  // Passed through to the MapGL component.
  const mapProps = {
    mapboxApiAccessToken: token,
    minZoom: DEFAULT_VIEWPORT.minZoom,
    maxZoom: DEFAULT_VIEWPORT.maxZoom,
    mapStyle: mapStyle,
    preserveDrawingBuffer: true,
    onMouseMove: handleMouseMove,
    onMouseOut: handleMouseOut,
    onResize: handleResize,
    onClick: handleClick,
  }

  return (
    <div
      className={clsx(classes.parent, {
        [classes.embed]: activeView === 'embed',
      })}
      style={!!isMobile ? { ...height } : {}}
    >
      <Mapbox
        ref={mapRef}
        defaultViewport={{
          ...DEFAULT_VIEWPORT,
        }}
        MapGLProps={mapProps}
        style={{ width: '100%', height: '100%' }}
        onLoad={handleLoad}
        maxBounds={DEFAULT_VIEWPORT.maxBounds}
      >
        {
          <>
            <MapPopup />
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
            {activeView === 'explorer' && (
              <>
                <MoreControlsContainer
                  mapRef={localMapRef}
                />
              </>
            )}
          </>
        }
      </Mapbox>
    </div>
  )
}

BaseMap.propTypes = {}

BaseMap.defaultProps = {}

export default BaseMap
