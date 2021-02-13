import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import { Tooltip, Button } from '@material-ui/core'

import useStore from './../store'
import LinearScale from './../LinearScale'

// Displays a list of indicator scales
// Has a button that opens and collapses the list
const IndicatorList = ({ ...props }) => {
  const {
    remoteJson,
    activeMetric,
    activeNorm,
    slideoutTract,
  } = useStore(state => ({
    remoteJson: state.remoteJson,
    activeMetric: state.activeMetric,
    activeNorm: state.activeNorm,
    slideoutTract: state.slideoutTract,
  }))
  // console.log('remoteJson, ', remoteJson)
  const prefix = props.subindex.replace('x', '')
  const indicators = remoteJson.indicators.data.filter(
    el => {
      return el.id.slice(0, 1) === prefix
    },
  )
  const rawTractData = remoteJson.raw.data.find(el => {
    return Number(el.GEOID) === slideoutTract
  })
  // console.log('prefix is ', prefix)
  // console.log('indicators are, ', indicators)
  return (
    <div className="slideout-indicator-list">
      <p>Button</p>

      {indicators.map(el => {
        const value = rawTractData[el.id]
        return (
          <>
            {' '}
            <h5>{i18n.translate(el.id)}</h5>
            <LinearScale indicator={el} value={value} />
          </>
        )
      })}
    </div>
  )
}

IndicatorList.propTypes = {
  subindex: PropTypes.string,
}

export default IndicatorList
