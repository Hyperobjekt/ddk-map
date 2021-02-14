import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'

/**
 * Static scale that renders standard deviation
 * parts, with the provided index emphasized.
 */
const SDScale = ({ ...props }) => {
  const styles = makeStyles(theme => ({
    root: {
      width: '100%',
      display: 'block',
      minHeight: '10px',
      // border: '1px solid red',
    },
    blocks: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: '16px',
      // border: '1px solid green',
    },
    labels: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: '20px',
      // border: '1px solid green',
    },
    block: {
      height: '14px',
      flex: '0 1 20%',
      backgroundColor: theme.extras.SDScale.offColors[0],
      border: `2px solid ${theme.extras.variables.colors.white}`,
      '&:nth-child(2)': {
        backgroundColor: theme.extras.SDScale.offColors[1],
      },
      '&:nth-child(3)': {
        backgroundColor: theme.extras.SDScale.offColors[2],
      },
      '&:nth-child(4)': {
        backgroundColor: theme.extras.SDScale.offColors[3],
      },
      '&:nth-child(5)': {
        backgroundColor: theme.extras.SDScale.offColors[4],
      },
      '&.active': {
        borderColor: theme.extras.SDScale.onColors[0],
        backgroundColor: theme.extras.SDScale.onColors[0],
        '&:nth-child(2)': {
          borderColor: theme.extras.SDScale.onColors[1],
          backgroundColor: theme.extras.SDScale.onColors[1],
        },
        '&:nth-child(3)': {
          borderColor: theme.extras.SDScale.onColors[2],
          backgroundColor: theme.extras.SDScale.onColors[2],
        },
        '&:nth-child(4)': {
          borderColor: theme.extras.SDScale.onColors[3],
          backgroundColor: theme.extras.SDScale.onColors[3],
        },
        '&:nth-child(5)': {
          borderColor: theme.extras.SDScale.onColors[4],
          backgroundColor: theme.extras.SDScale.onColors[4],
        },
      },
    },
    label: {
      flex: '1 1 20%',
      textAlign: 'center',
      fontWeight: 600,
      fontSize: '12px',
      height: '12px',
    },
  }))

  const classes = styles()

  const SDArray = [
    i18n.translate(`SDSCALE_VLOW`),
    i18n.translate(`SDSCALE_LOW`),
    i18n.translate(`SDSCALE_MOD`),
    i18n.translate(`SDSCALE_HIGH`),
    i18n.translate(`SDSCALE_VHIGH`),
  ]
  return (
    <div
      className={clsx('sd-scale-parent', classes.root)}
      {...props}
    >
      <div
        className={clsx('sd-scale-blocks', classes.blocks)}
      >
        {SDArray.map((el, i) => {
          return (
            <div
              className={clsx(
                'sd-scale-block',
                props.active[i] === 1 ? 'active' : '',
                classes.block,
              )}
              key={`sd-scale-block-${i}`}
            ></div>
          )
        })}
      </div>
      <div
        className={clsx('sd-scale-labels', classes.labels)}
      >
        {SDArray.map((el, i) => {
          return (
            <div
              className={clsx(
                'sd-scale-item',
                props.active[i] === 1 ? 'active' : '',
                classes.label,
              )}
              aria-label={el}
              key={`sd-scale-label-${i}`}
            >
              <div className="sd-scale-item-label">
                {el.toUpperCase()}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

SDScale.propTypes = {
  active: PropTypes.array,
}

export default SDScale
