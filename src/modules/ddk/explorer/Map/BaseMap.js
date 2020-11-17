import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import Mapbox from '@hyperobjekt/mapbox'

import useStore from './../store'
import theme from './../theme'
import { DEFAULT_VIEWPORT } from './../../../../constants/map'

const BaseMap = ({ ...props }) => {
  const styles = makeStyles(theme => ({
    root: {},
  }))

  const classes = styles()

  return (
    <Mapbox defaultViewport={DEFAULT_VIEWPORT}>
      {/**
        <MapLegend />
        <div className="custom-attribution">
          <span className="divider">|</span>
          <span
            dangerouslySetInnerHTML={{
              __html: i18n.translate(`MAP_UI_POWERED_BY`),
            }}
          ></span>
        </div>
        <div className={clsx('map__zoom', cx(mapZoomStyles))}>
          {activeView === 'explorer' && (
            <>
              <NavigationControl
                showCompass={false}
                onViewportChange={setViewport}
                captureClick={true}
              ></NavigationControl>
              <MapResetButton
                resetViewport={handleResetViewport}
              />
              <MapCaptureButton currentMap={currentMap} />
            </>
          )}
        </div>
      */}
    </Mapbox>
  )
}

BaseMap.propTypes = {}

BaseMap.defaultProps = {}

export default BaseMap
