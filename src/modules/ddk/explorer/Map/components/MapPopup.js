import React, { useEffect, useState } from 'react'
import { Popup } from 'react-map-gl'
import shallow from 'zustand/shallow'

import useStore from './../../store'
import PopupContent from './PopupContent'
import { theme } from './../../theme'

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

  const [popupCoords, setPopupCoords] = useState([
    coords[0],
    coords[1],
  ])

  const [popupAnchor, setPopupAnchor] = useState('top-left')
  const [popupOffset, setPopupOffset] = useState([50, 50])

  const updatePopupCoords = () => {
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
    setPopupOffset([offset, offset])
    if (closeToRight) {
      setPopupAnchor('top-right')
      setPopupOffset([offset * -1, offset])
    }
    if (closetoBottom) {
      setPopupAnchor('bottom-left')
      setPopupOffset([offset, offset * -1])
    }
    if (closeToRight && closetoBottom) {
      setPopupAnchor('bottom-right')
      setPopupOffset([offset * -1, offset * -1])
    }
    setPopupCoords([coords[0], coords[1]])
  }

  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    // console.log('Updating show popup')
    setShowPopup(hoveredTract !== 0)
    updatePopupCoords()
    // console.log('updatePopupCoords, ', updatePopupCoords())
  }, [hoveredTract])

  return (
    !!displayPopup &&
    !!showPopup &&
    !!popupCoords && (
      <Popup
        latitude={popupCoords[1]}
        longitude={popupCoords[0]}
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
