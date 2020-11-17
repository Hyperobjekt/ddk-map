import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import ReactMapGL, {
  NavigationControl,
  Popup,
} from 'react-map-gl'
import Mapbox from '@hyperobjekt/mapbox'

import useStore from './../store'
import theme from './../theme'
import { DEFAULT_VIEWPORT } from './../../../../constants/map'

const BaseMap = ({ ...props }) => {
  const activeView = useStore(state => state.activeView)

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

  const token = process.env.GATSBY_MAPBOX_API_TOKEN
  const viewport = DEFAULT_VIEWPORT

  const mapProps = {
    mapboxApiAccessToken: token,
    width: classes.parent.width,
    ...viewport,
  }

  return (
    <div className={clsx(classes.parent)}>
      <Mapbox
        defaultViewport={DEFAULT_VIEWPORT}
        MapGLProps={mapProps}
        mapStyle={
          'mapbox://styles/ddkids/ckhmbktzi142u19ois58yahb2'
        }
        style={{ width: '100%', height: '100%' }}
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
                    // onViewportChange={setViewport}
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
