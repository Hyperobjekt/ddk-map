import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import { Tooltip, Button } from '@material-ui/core'
import shallow from 'zustand/shallow'

import useStore from './../../store'
import { STATES } from './../../../../../constants/map'

const FlyToStateBtn = ({ children, ...props }) => {
  const { flyToState } = useStore(
    state => ({
      flyToState: state.flyToState,
    }),
    shallow,
  )

  const handleClick = () => {
    setStoreValues({
      controlHovered: true,
    })
    flyToState(props.fips.padStart(2, '0'))
  }

  return (
    <Tooltip
      title={i18n.translate(`MAP_FLY_TO_STATE`, {
        state: STATES[props.fips].full,
      })}
      arrow
    >
      <Button
        aria-label={i18n.translate(`MAP_FLY_TO_STATE`, {
          state: STATES[props.fips].full,
        })}
        onClick={handleClick}
        placement={props.placement}
        className={props.className}
      >
        {children}
      </Button>
    </Tooltip>
  )
}

FlyToStateBtn.propTypes = {
  fips: PropTypes.string,
}

export default FlyToStateBtn
