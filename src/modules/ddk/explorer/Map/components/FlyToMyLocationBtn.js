import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import { Tooltip, Button } from '@material-ui/core'
import shallow from 'zustand/shallow'

import useStore from './../../store'

const FlyToMyLocationBtn = ({ children, ...props }) => {
  const { flyToLatLon } = useStore(
    state => ({
      flyToLatLon: state.flyToLatLon,
    }),
    shallow,
  )

  const [position, setPosition] = useState(null)

  const handleClick = () => {
    console.log('handleClick')
    flyToLatLon(
      position.coords.latitude,
      position.coords.longitude,
      12,
    )
  }

  useEffect(() => {
    // Store the user's location when the app loads, to save time.
    if (
      'geolocation' in navigator &&
      navigator.permissions &&
      navigator.permissions.query({ name: 'geolocation' })
    ) {
      console.log('loaded. setting position.')
      navigator.geolocation.getCurrentPosition(position => {
        setPosition(position)
      })
    }
  }, [])

  if (
    'geolocation' in navigator &&
    navigator.permissions &&
    navigator.permissions.query({ name: 'geolocation' })
  ) {
    return (
      <Tooltip
        title={i18n.translate(`MAP_FLY_TO_MY`)}
        arrow
      >
        <Button
          aria-label={i18n.translate(`MAP_FLY_TO_MY`)}
          onClick={handleClick}
          placement={props.placement}
        >
          {children}
        </Button>
      </Tooltip>
    )
  } else {
    return ''
  }
}

FlyToMyLocationBtn.propTypes = {}

export default FlyToMyLocationBtn
