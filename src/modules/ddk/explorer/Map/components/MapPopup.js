import React, { useEffect, useMemo, useState } from 'react'
import { Popup } from 'react-map-gl'
import shallow from 'zustand/shallow'

import useStore from './../../store'
import PopupContent from './PopupContent'
import { theme } from './../../theme'

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

function usePopupState() {
  const {
    coords,
    mouseXY,
    hoveredTract,
    hoveredFeature,
    displayPopup,
    mapSize,
    controlHovered,
    interactionsMobile,
  } = useStore(
    state => ({
      coords: state.coords,
      mouseXY: state.mouseXY,
      hoveredTract: state.hoveredTract,
      hoveredFeature: state.hoveredFeature,
      displayPopup: state.displayPopup,
      mapSize: state.mapSize,
      controlHovered: state.controlHovered,
      interactionsMobile: state.interactionsMobile,
    }),
    shallow,
  )

  const showPopup =
    Boolean(coords) &&
    Boolean(displayPopup) &&
    hoveredTract !== 0 &&
    !controlHovered &&
    interactionsMobile === false
  const popupCoords = showPopup ? coords : null
  const { popupAnchor, popupOffset } = getPopupProps({
    mouseXY,
    mapSize,
  })
  return useMemo(() => {
    return {
      show: showPopup,
      coords: popupCoords,
      anchor: popupAnchor,
      offset: popupOffset,
      feature: hoveredFeature,
    }
  }, [
    showPopup,
    popupCoords,
    popupAnchor,
    popupOffset,
    hoveredFeature,
  ])
}

const MapPopup = ({ ...props }) => {
  const {
    show,
    coords,
    anchor,
    offset,
    feature,
  } = usePopupState()

  return (
    show && (
      <Popup
        latitude={coords[1]}
        longitude={coords[0]}
        closeButton={false}
        tipSize={0}
        anchor={anchor}
        offsetTop={offset[1]}
        offsetLeft={offset[0]}
      >
        <PopupContent feature={feature} />
      </Popup>
    )
  )
}

export default MapPopup
