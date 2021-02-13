import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import { Tooltip, Button } from '@material-ui/core'
import { FiChevronDown } from 'react-icons/fi'

import useStore from './../store'
import LinearScale from './../LinearScale'

const styles = makeStyles(theme => ({
  root: {},
  btn: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    '& > span': {
      float: 'left',
    },
    margin: '8px 0 8px',
  },
  collapse: {
    height: 0,
    overflowY: 'hidden',
    maxHeight: 0,
    transition: 'max-height 200ms ease-in-out',
    padding: '0 0.5rem',
    '& .linear-scale': {
      margin: '8px 0',
    },
  },
  collapseOpen: {
    height: 'auto',
    maxHeight: '800px',
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
}))

// Displays a list of indicator scales
// Has a button that opens and collapses the list
const IndicatorList = ({ ...props }) => {
  const classes = styles()

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

  const [isOpen, setIsOpen] = useState(props.isOpen)
  const toggleIsOpen = () => {
    setIsOpen(!isOpen)
  }
  const buttonLabel = !!isOpen
    ? i18n.translate('SCALE_INDICATORS_HIDE')
    : i18n.translate('SCALE_INDICATORS_SHOW')

  // console.log('isOpen, ', isOpen)
  return (
    <div className="slideout-indicator-list">
      <Button
        onClick={toggleIsOpen}
        ariaLabel={buttonLabel}
        className={clsx(
          'indicator-list-toggle',
          classes.btn,
        )}
      >
        <span>{buttonLabel}</span>
        <FiChevronDown
          className={clsx(
            'indicator-btn-caret',
            classes.caret,
            !!isOpen ? classes.caretUp : null,
          )}
        />
      </Button>
      <div
        className={clsx(
          'slideout-indicator-collapse',
          classes.collapse,
          !!isOpen ? classes.collapseOpen : null,
          !!isOpen ? 'open' : null,
        )}
      >
        {indicators.map(el => {
          const value = Number(rawTractData[el.id])
          return (
            <>
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
                >
                  {i18n.translate(el.id)}
                </span>
              </Tooltip>
              <LinearScale indicator={el} value={value} />
            </>
          )
        })}
      </div>
    </div>
  )
}

IndicatorList.propTypes = {
  subindex: PropTypes.string,
  isOpen: PropTypes.Boolean,
}

export default IndicatorList
