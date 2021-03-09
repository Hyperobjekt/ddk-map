import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'

import { getRoundedValue, getHashLeft } from './../utils'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '40px',
    position: 'relative',
  },
  bar: {
    height: '3px',
    width: '100.2%',
    display: 'block',
    top: 0,
    left: 0,
    backgroundImage:
      'linear-gradient(90deg, #C9E8F8 0%, #58798F 101.52%)',
    backgroundSize: '100% 3px',
  },
  hashGroup: {
    position: 'absolute',
    boxSizing: 'content-box',
  },
  hash: {
    width: '0.5px',
    height: '22px',
    backgroundColor: '#58798F',
  },
  hashMean: {
    width: '0.5px',
    height: '5px',
    backgroundColor: '#58798F',
  },
  scaleLabelGroup: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  scaleLabel: {
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.4px',
  },
  hashLabel: {
    width: '60px',
    marginLeft: '-50%',
    // marginTop: '-1px',
    display: 'block',
    textAlign: 'center',
  },
  valueLabel: {
    fontWeight: 500,
  },
}))

const LinearScale = ({ ...props }) => {
  // console.log('LinearScale, ', props)

  const classes = useStyles()

  const high_is_good = !!props.indicator.high_is_good
  const currency = !!props.indicator.curr
  const decimals = Number(props.indicator.dec)
  const alt_u = props.indicator.alt_u
  const min = Number(props.indicator.min)
  const max = Number(props.indicator.max)
  const mean = Number(props.indicator.mean)
  const percent = false

  /**
   * Founds a number in exponential notation to a whole number.
   * @param Number val Number in scientific notation
   * @returns String
   */
  const formatExponent = val => {
    if (val < 1 && val > -1) {
      return String(Math.round(val).toPrecision(1))
    } else {
      return getRoundedValue(val, 0, true, false, false)
    }
  }

  const rightVal = !!high_is_good ? max : min
  const leftVal = !!high_is_good ? min : max

  const rightLabel =
    String(rightVal).indexOf('e') > 0
      ? formatExponent(rightVal)
      : `${getRoundedValue(
          rightVal,
          decimals,
          true,
          currency,
          percent,
        )}`
  const leftLabel =
    String(leftVal).indexOf('e') > 0
      ? formatExponent(leftVal)
      : `${getRoundedValue(
          leftVal,
          decimals,
          true,
          currency,
          percent,
        )}`
  const valueLabel =
    String(props.value).indexOf('e') > 0
      ? formatExponent(props.value)
      : `${getRoundedValue(
          props.value,
          decimals,
          true,
          currency,
          percent,
        )}`

  const meanLabel = i18n.translate(`SCALE_MEAN`)
  const percentFromLeft = `${Math.round(
    getHashLeft(
      props.value,
      !!high_is_good ? min : max,
      !!high_is_good ? max : min,
    ),
  )}%`
  const meanPercentFromLeft = `${Math.round(
    getHashLeft(
      mean,
      !!high_is_good ? min : max,
      !!high_is_good ? max : min,
    ),
  )}%`

  return (
    <div className={clsx('linear-scale', classes.root)}>
      <div
        className={clsx('linear-scale-bar', classes.bar)}
      ></div>
      <div
        className={clsx(
          'linear-scale-value',
          classes.hashGroup,
        )}
        style={{ left: percentFromLeft }}
      >
        <div
          className={clsx(
            'linear-scale-hash-value',
            classes.hash,
          )}
        ></div>
        <span
          className={clsx(
            'label',
            classes.scaleLabel,
            classes.hashLabel,
            classes.valueLabel,
          )}
        >
          {valueLabel}
        </span>
      </div>
      <div
        className={clsx(
          'linear-scale-mean',
          classes.hashGroup,
        )}
        style={{ left: meanPercentFromLeft }}
      >
        <div
          className={clsx(
            'linear-scale-hash-mean',
            classes.hashMean,
          )}
        ></div>
        <span
          className={clsx(
            'label',
            classes.scaleLabel,
            classes.hashLabel,
          )}
        >
          {meanLabel}
        </span>
      </div>
      <div
        className={clsx(
          'linear-scale-labels',
          classes.scaleLabelGroup,
        )}
      >
        <div className={clsx('linear-scale-label-left')}>
          <span
            className={clsx('label', classes.scaleLabel)}
          >
            {leftLabel}
          </span>
        </div>
        <div className={clsx('linear-scale-label-right')}>
          <span
            className={clsx('label', classes.scaleLabel)}
          >
            {rightLabel}
          </span>
        </div>
      </div>
    </div>
  )
}

LinearScale.propTypes = {
  indicator: PropTypes.object,
  value: PropTypes.number,
}

export default LinearScale
