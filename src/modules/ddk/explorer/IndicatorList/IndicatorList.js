import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import { Tooltip, Button } from '@material-ui/core'
import { FiChevronDown } from 'react-icons/fi'
import shallow from 'zustand/shallow'

import useStore from './../store'
import LinearScale from './../LinearScale'

const useStyles = makeStyles(theme => ({
  root: {},
  btn: {
    color: theme.extras.variables.colors.ddkRed,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    '& > span': {
      float: 'left',
    },
    margin: '8px 0 0',
    '&.open': {
      margin: '8px 0 8px',
    },
  },
  collapse: {
    height: 0,
    overflowY: 'hidden',
    maxHeight: 0,
    transition: 'max-height 200ms ease-in-out',
    padding: '0 1rem',
    '& .linear-scale': {
      margin: '8px 0',
    },
  },
  collapseOpen: {
    overflowX: 'hidden',
    height: 'auto',
    maxHeight: '1200px',
    transition: 'max-height 200ms ease-in-out',
  },
  caret: {
    float: 'right',
  },
  caretUp: {
    transform: 'rotate(180deg)',
  },
  heading: {
    margin: '8px 0 0',
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.25px',
    fontWeight: 600,
    borderBottom: `1px dashed ${theme.extras.variables.colors.darkGray}`,
    color: theme.extras.variables.colors.darkGray,
  },
  indicator: {
    '&:first-of-type': {
      marginTop: '1rem',
    },
  },
}))

// Displays a list of indicator scales
// Has a button that opens and collapses the list
const IndicatorList = props => {
  // console.log('IndicatorList(), ', props)
  const classes = useStyles()

  const { remoteJson, slideoutTract } = useStore(
    state => ({
      remoteJson: state.remoteJson,
      slideoutTract: state.slideoutTract,
    }),
    shallow,
  )

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

  const callToggleSub = () => {
    props.toggleSub(props.subIndex)
  }

  const buttonLabel = props.isOpen
    ? i18n.translate('SCALE_INDICATORS_HIDE')
    : i18n.translate('SCALE_INDICATORS_SHOW')

  // console.log('isOpen, ', isOpen)
  return (
    <div className="slideout-indicator-list">
      <Button
        onClick={callToggleSub}
        aria-label={buttonLabel}
        className={clsx(
          'indicator-list-toggle',
          classes.btn,
          props.isOpen ? 'open' : '',
        )}
      >
        <span>{buttonLabel}</span>
        <FiChevronDown
          className={clsx(
            'indicator-btn-caret',
            classes.caret,
            props.isOpen ? classes.caretUp : null,
          )}
        />
      </Button>
      <div
        className={clsx(
          'slideout-indicator-collapse',
          classes.collapse,
          props.isOpen ? classes.collapseOpen : null,
          props.isOpen ? 'open' : null,
        )}
      >
        {indicators.map((el, i) => {
          const value = Number(rawTractData[el.id])
          return (
            <div
              className={clsx(
                'indicator',
                `indicator-${el.id}`,
                classes.indicator,
              )}
              key={`indicator-${el.id}`}
            >
              <Tooltip
                title={
                  <React.Fragment>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: i18n.translate(
                          `${el.id}_desc`,
                        ),
                      }}
                    ></span>
                  </React.Fragment>
                }
                arrow
              >
                <span
                  role="heading"
                  aria-level="5"
                  className={clsx(classes.heading)}
                  dangerouslySetInnerHTML={{
                    __html:
                      `${i18n.translate(el.id)} ` +
                      (el.alt_u
                        ? `(${i18n.translate(el.alt_u)})`
                        : ''),
                  }}
                ></span>
              </Tooltip>
              <LinearScale indicator={el} value={value} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

IndicatorList.propTypes = {
  subindex: PropTypes.string,
  isOpen: PropTypes.bool,
  toggleSub: PropTypes.func,
  subIndex: PropTypes.number,
}

export default IndicatorList
