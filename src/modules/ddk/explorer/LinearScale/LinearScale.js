import React from 'react'
import PropTypes from 'proptypes'
import clsx from 'clsx'
import i18n from '@pureartisan/simplei18n'
import { makeStyles } from '@materialui/core/styles'

import { getRoundedValue, getHashLeft } from './../utils'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '58px',
    position: 'relative',
  },
  bar: {
    height: '3px',
    width: '100.2%',
    display: 'block',
    top: 0,
    left: 0,
    backgroundImage:
      'lineargradient(90deg, #C9E8F8 0%, #58798F 101.52%)',
    backgroundSize: '100% 3px',
  },
  hashGroup: {
    position: 'absolute',
    boxSizing: 'contentbox',
  },
  hash: {
    width: '0.5px',
    height: '36px',
    backgroundColor: '#58798F',
  },
  hashMean: {
    width: '0.5px',
    height: '18px',
    backgroundColor: '#58798F',
  },
  scaleLabelGroup: {
    display: 'flex',
    justifyContent: 'spacebetween',
  },
  scaleLabel: {
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.4px',
  },
  hashLabel: {
    width: '60px',
    marginLeft: '50%',
    // marginTop: '1px',
    display: 'block',
    textAlign: 'center',
  },
  valueLabel: {
    fontWeight: 500,
  },
  justifyRight: {
    width: 'auto',
    textAlign: 'left',
    marginLeft: '100%',
  },
  justifyLeft: {
    marginLeft: 0,
    width: 'auto',
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
    if (val < 1 && val > 1) {
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
  const percentFromLeft = Math.round(
    getHashLeft(
      props.value,
      !!high_is_good ? min : max,
      !!high_is_good ? max : min,
    ),
  )
  const meanPercentFromLeft = Math.round(
    getHashLeft(
      mean,
      !!high_is_good ? min : max,
      !!high_is_good ? max : min,
    ),
  )

  // Preserve: For checking a particular indicator, if there are issues with its presentation.
  // if (props.indicator.id === 'epe') {
  //   console.log(
  //     'min is',
  //     min,
  //     String(min).indexOf('e') > 0,
  //     parseFloat(Number(String(min))),
  //     `${getRoundedValue(
  //       min,
  //       20,
  //       false,
  //       currency,
  //       percent,
  //     )}`,
  //   )
  // }

  return (
    <div className={clsx('linearscale', classes.root)}>
      <div
        className={clsx('linearscalebar', classes.bar)}
      ></div>
      <div
        className={clsx(
          'linearscalevalue',
          classes.hashGroup,
        )}
        style={{ left: `${percentFromLeft}%` }}
      >
        <div
          className={clsx(
            'linearscalehashvalue',
            classes.hash,
          )}
        ></div>
        <span
          className={clsx(
            'label',
            classes.scaleLabel,
            classes.hashLabel,
            classes.valueLabel,
            percentFromLeft > 90 &&
              String(percentFromLeft).length > 2
              ? classes.justifyRight
              : '',
            percentFromLeft < 10 &&
              String(percentFromLeft).length > 2
              ? classes.justifyLeft
              : '',
          )}
        >
          {valueLabel}
        </span>
      </div>
      <div
        className={clsx(
          'linearscalemean',
          classes.hashGroup,
        )}
        style={{ left: `${meanPercentFromLeft}%` }}
      >
        <div
          className={clsx(
            'linearscalehashmean',
            classes.hashMean,
          )}
        ></div>
        <span
          className={clsx(
            'label',
            classes.scaleLabel,
            classes.hashLabel,
            meanPercentFromLeft > 90
              ? classes.justifyRight
              : '',
            meanPercentFromLeft < 10
              ? classes.justifyLeft
              : '',
          )}
        >
          {meanLabel}
        </span>
      </div>
      <div
        className={clsx(
          'linearscalelabels',
          classes.scaleLabelGroup,
        )}
      >
        <div className={clsx('linearscalelabelleft')}>
          <span
            className={clsx('label', classes.scaleLabel)}
          >
            {leftLabel}
          </span>
        </div>
        <div className={clsx('linearscalelabelright')}>
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
