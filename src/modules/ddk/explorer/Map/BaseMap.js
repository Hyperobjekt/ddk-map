import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
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

import Legend from './../Legend'
import useStore from './../store'
import theme from './../theme'
import { DEFAULT_VIEWPORT } from './../../../../constants/map'
import { defaultMapStyle } from './utils/selectors'
import { getLayers } from './utils/layers'

const BaseMap = ({ ...props }) => {
  const activeView = useStore(state => state.activeView)
  const dataVersion = useStore(state => state.dataVersion)

  // Token and viewport passed to the map.
  const token = process.env.MAPBOX_API_TOKEN

  const [loaded, setLoaded] = useState(false)

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

  const handleClick = e => {
    // console.log('Map click, ', e)
  }

  const handleHover = e => {
    console.log('Map hover, ', e)
  }

  const handleLoad = () => {
    // console.log('Map loaded.')
    setLoaded(true)
  }

  const getMapSources = () => {
    const versionStr = dataVersion.replace(/\./g, '-')
    const mapboxUser = process.env.MAPBOX_USER

    // TODO: Conditinally load dot data based on years set from hash.
    return fromJS({
      ddkids: {
        url:
          `mapbox://${mapboxUser}.shapes_${versionStr}?access_token=${token}` +
          `${mapboxUser}.points_w15_${versionStr}?access_token=${token},` +
          `${mapboxUser}.points_h15_${versionStr}?access_token=${token},` +
          `${mapboxUser}.points_b15_${versionStr}?access_token=${token},` +
          `${mapboxUser}.points_ap15_${versionStr}?access_token=${token},` +
          `${mapboxUser}.points_ai15_${versionStr}?access_token=${token}`,
        type: 'vector',
      },
    })
  }

  /** memoized array of shape and point layers */
  const layers = useMemo(
    () => {
      // if (
      //   !metric ||
      //   !activeQuintiles ||
      //   !activeLayers ||
      //   !allDataLoaded
      // ) {
      //   return []
      // }
      // const context = { metric, activeQuintiles }
      const context = {}
      return getLayers(
        getMapSources(),
        context,
        // activeLayers,
        // activePointTypes,
        // activePointTypesKey,
      )
    },
    [
      // allDataLoaded,
      // metric,
      // activeQuintiles,
      // activeLayers,
      // activePointTypes,
    ],
  )

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

  // const mapStyleJSON =
  //   'mapbox://styles/ddkids/ckhmbktzi142u19ois58yahb2'

  // update map style layers when layers change
  const mapStyle = useMemo(
    () =>
      getUpdatedMapStyle(
        defaultMapStyle,
        layers,
        getMapSources(),
      ),
    // [style, layers, sources],
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
  useEffect(() => {
    // console.log('mapViewport changed,', mapViewport)
    resetViewportState(mapViewport[0])
  }, [mapViewport])

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
  }

  return (
    <div className={clsx(classes.parent)}>
      <Mapbox
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
