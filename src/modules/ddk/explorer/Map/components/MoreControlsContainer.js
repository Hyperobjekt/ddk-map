import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import FlyToStateBtn from './FlyToStateBtn'
import FlyToResetBtn from './FlyToResetBtn'
import FlyToMyLocationBtn from './FlyToMyLocationBtn'
import ScreenshotBtn from './ScreenshotBtn'
import {
  CrosshairIcon,
  AlaskaIcon,
  HawaiiIcon,
  USIcon,
  CameraIcon,
} from './../../../../assets/Icons'

const styles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    bottom: '88px',
    right: '16px',
    width: '40px',
    height: 'auto',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
    '& button': {
      width: '28px', // '32px',
      height: '28px', // '32px',
      backgroundColor: '#fff',
      padding: 0,
      minWidth: 0,
      borderRadius: 0,
    },
  },
  button: {
    backgroundColor: '#fff',
    '&:hover': {
      backgroundColor: `${theme.extras.variables.colors.ddkLightRedHex} !important`,
    },
    '& svg': {
      width: '20px',
      height: '20px',
    },
    marginTop: '0.15rem',
    '& .MuiButton-label': {
      width: '28px',
      height: '28px',
    },
    '&.btn-reset svg': {
      marginTop: '6px',
      marginLeft: '1px',
    },
    '&.map-fly-to-btn svg': {
      width: '18px',
      height: '18px',
    },
  },
}))

const MoreControlsContainer = props => {
  const classes = styles()

  return (
    <div className={clsx('more-controls', classes.root)}>
      <ScreenshotBtn
        className={clsx(classes.button)}
        mapRef={props.mapRef}
      >
        <CameraIcon />
      </ScreenshotBtn>
      <FlyToStateBtn
        fips="2"
        placement={'left'}
        className={clsx(classes.button)}
      >
        <AlaskaIcon />
      </FlyToStateBtn>
      <FlyToStateBtn
        fips="15"
        placement={'left'}
        className={clsx(classes.button)}
      >
        <HawaiiIcon />
      </FlyToStateBtn>
      <FlyToResetBtn
        placement="left"
        className={clsx(classes.button)}
      >
        <USIcon />
      </FlyToResetBtn>
      <FlyToMyLocationBtn
        placement="left"
        className={clsx(classes.button)}
      >
        <CrosshairIcon />
      </FlyToMyLocationBtn>
    </div>
  )
}

export default MoreControlsContainer
