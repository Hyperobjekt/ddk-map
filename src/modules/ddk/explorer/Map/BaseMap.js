import React, {
  useState,
  useCallback,
  useEffect,
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

import useStore from './../store'
import theme from './../theme'
import {
  DEFAULT_VIEWPORT,
  BOUNDS,
} from './../../../../constants/map'

const BaseMap = ({ ...props }) => {
  const activeView = useStore(state => state.activeView)

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
    // console.log('Map hover, ', e)
  }

  const handleLoad = () => {
    // console.log('Map loaded.')
    setLoaded(true)
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
      // if (vp.longitude && vp.longitude < BOUNDS.lng.min) {
      //   // console.log('panned beyond lng.min')
      //   vp.longitude = BOUNDS.lng.min
      // }
      // if (vp.longitude && vp.longitude > BOUNDS.lng.max) {
      //   // console.log('panned beyond lng.max')
      //   vp.longitude = BOUNDS.lng.max
      // }
      // if (vp.latitude && vp.latitude < BOUNDS.lat.min) {
      //   // console.log('panned beyond lat.min')
      //   vp.latitude = BOUNDS.lat.min
      // }
      // if (vp.latitude && vp.latitude > BOUNDS.lat.max) {
      //   // console.log('panned beyond lat.max')
      //   vp.latitude = BOUNDS.lat.max
      // }
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

  // Token and viewport passed to the map.
  const token = process.env.GATSBY_MAPBOX_API_TOKEN
  // Passed through to the MapGL component.
  const mapProps = {
    mapboxApiAccessToken: token,
    // maxBounds: DEFAULT_VIEWPORT.maxBounds, // Doesn't work.
    minZoom: DEFAULT_VIEWPORT.minZoom,
    maxZoom: DEFAULT_VIEWPORT.maxZoom,
  }

  return (
    <div className={clsx(classes.parent)}>
      <Mapbox
        defaultViewport={{ ...viewport }}
        MapGLProps={mapProps}
        mapStyle={
          'mapbox://styles/ddkids/ckhmbktzi142u19ois58yahb2'
        }
        style={{ width: '100%', height: '100%' }}
        onClick={handleClick}
        onHover={handleHover}
        onLoad={handleLoad}
      >
        {
          <>
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
