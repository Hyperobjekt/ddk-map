import React, { useEffect, useState } from 'react'
import { Popup } from 'react-map-gl'
import shallow from 'zustand/shallow'
// import * as turf from '@turf/turf'

import useStore from './../../store'
import PopupContent from './PopupContent'

const MapPopup = ({ ...props }) => {
  // console.log('MapPopup')
  const {
    coords,
    mouseXY,
    hoveredTract,
    hoveredFeature,
    displayPopup,
  } = useStore(state => ({
    coords: state.coords,
    mouseXY: state.mouseXY,
    hoveredTract: state.hoveredTract,
    hoveredFeature: state.hoveredFeature,
    displayPopup: state.displayPopup,
  }))

  const [popupCoords, setPopupCoords] = useState([
    coords[0],
    coords[1],
  ])

  const [popupAnchor, setPopupAnchor] = useState('top')

  const updatePopupCoords = () => {
    // console.log('feature', hoveredFeature)
    // if (
    //   !!hoveredFeature &&
    //   !!hoveredFeature.geometry &&
    //   !!hoveredFeature.geometry.coordinates
    // ) {
    //   console.log(
    //     'coordinates, ',
    //     hoveredFeature.geometry.coordinates,
    //   )
    //   var line = turf.lineString(
    //     hoveredFeature.geometry.coordinates[0],
    //   )
    //   const featureBox = turf.bbox(line)
    //   // console.log('featureBox, ', featureBox)
    //   const boxWidth = featureBox[2] - featureBox[0]
    //   const boxHeight = featureBox[3] - featureBox[1]
    //   setPopupCoords([
    //     featureBox[0] + boxWidth / 2,
    //     featureBox[1],
    //   ])
    setPopupCoords([coords[0], coords[1]])
    // }
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
        offsetTop={100}
      >
        <PopupContent feature={hoveredFeature} />
      </Popup>
    )
  )
}

export default MapPopup
