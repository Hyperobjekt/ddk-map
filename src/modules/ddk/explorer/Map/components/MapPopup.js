import React, { useEffect, useState } from 'react'
import { Popup } from 'react-map-gl'
import shallow from 'zustand/shallow'

import useStore from './../../store'
import PopupContent from './PopupContent'
import { theme } from './../../theme'

let count = 0

/**
 * Get the anchor and offset based on x / y and map size
 * @returns {object} {popupAnchor, popupOffset}
 */
const getPopupProps = ({ mouseXY, mapSize }) => {
  // console.log('mapSize, ', mapSize, mouseXY)
  const popupWidth = theme.extras.mapPopup.width
  const popupHeight = theme.extras.mapPopup.height
  const padding = theme.extras.mapPopup.edgePadding
  const offset = theme.extras.mapPopup.offset
  let setX = mouseXY[0] + offset
  let setY = mouseXY[1] + offset
  let closeToRight = false
  let closetoBottom = false
  // If mouse is close to right edge...
  if (setX + popupWidth + padding > mapSize[0]) {
    // console.log('off the right edge, resetting')
    closeToRight = true
  }
  // If mouse is close to bottom...
  if (setY + popupHeight + padding > mapSize[1]) {
    // console.log('off the bottom edge, resetting')
    closetoBottom = true
  }
  let anchor = 'top-left'
  let popupOffset = [offset, offset]
  if (closeToRight) {
    anchor = 'top-right'
    popupOffset = [offset * -1, offset]
  }
  if (closetoBottom) {
    anchor = 'bottom-left'
    popupOffset = [offset, offset * -1]
  }
  if (closeToRight && closetoBottom) {
    anchor = 'bottom-right'
    popupOffset = [offset * -1, offset * -1]
  }
  return {
    popupAnchor: anchor,
    popupOffset,
  }
}

const MapPopup = ({ ...props }) => {
  // console.log('MapPopup')
  const {
    coords,
    mouseXY,
    hoveredTract,
    hoveredFeature,
    displayPopup,
    mapSize,
  } = useStore(
    state => ({
      coords: state.coords,
      mouseXY: state.mouseXY,
      hoveredTract: state.hoveredTract,
      hoveredFeature: state.hoveredFeature,
      displayPopup: state.displayPopup,
      mapSize: state.mapSize,
    }),
    shallow,
  )
  const { popupAnchor, popupOffset } = getPopupProps({
    mouseXY,
    mapSize,
  })
  const showPopup = hoveredTract !== 0

  console.log('popup render count', count++)

  return (
    !!displayPopup &&
    !!showPopup &&
    !!coords && (
      <Popup
        latitude={coords[1]}
        longitude={coords[0]}
        closeButton={false}
        tipSize={0}
        anchor={popupAnchor}
        offsetTop={popupOffset[1]}
        offsetLeft={popupOffset[0]}
      >
        <PopupContent feature={hoveredFeature} />
      </Popup>
    )
  )
}

export default MapPopup
