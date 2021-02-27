import React, { useState } from 'react'
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

  const handleClick = () => {
    // console.log('handleClick')
    navigator.geolocation.getCurrentPosition(position => {
      // console.log('position, ', position)
      flyToLatLon(
        position.coords.latitude,
        position.coords.longitude,
        14,
      )
    })
  }

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
