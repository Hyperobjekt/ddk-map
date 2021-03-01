import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import { Tooltip, Button } from '@material-ui/core'
import shallow from 'zustand/shallow'

import useStore from './../../store'
import { DEFAULT_VIEWPORT } from './../../../../../constants/map'

const FlyToResetBtn = ({ children, ...props }) => {
  const { flyToLatLon } = useStore(
    state => ({
      flyToLatLon: state.flyToLatLon,
    }),
    shallow,
  )
  // console.log('DEFAULT_VIEWPORT', DEFAULT_VIEWPORT)

  const handleClick = () => {
    flyToLatLon(
      DEFAULT_VIEWPORT.latitude,
      DEFAULT_VIEWPORT.longitude,
      DEFAULT_VIEWPORT.zoom,
    )
  }

  return (
    <Tooltip title={i18n.translate(`MAP_RESET`)} arrow>
      <Button
        aria-label={i18n.translate(`MAP_RESET`)}
        onClick={handleClick}
        placement={props.placement}
        className={props.className}
      >
        {children}
      </Button>
    </Tooltip>
  )
}

FlyToResetBtn.propTypes = {
  placement: PropTypes.string,
}

export default FlyToResetBtn
