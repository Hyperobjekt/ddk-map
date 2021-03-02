import React, { useState } from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import shallow from 'zustand/shallow'
import { FiChevronDown } from 'react-icons/fi'

import useStore from './../store'
import {
  MAIN_INDEX,
  SUB_INDICES,
} from './../../../../constants/map'
import SDScale from './../SDScale'
import { getActiveArray } from './../utils'
import PopStack from './../PopStack'
import IndicatorList from './../IndicatorList'

// Styles for this component.
const styles = makeStyles(theme => ({
  root: {
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    'font-family': 'Fira Sans',
    backgroundColor:
      theme.extras.variables.colors.lightLightGray,
  },
  content: {
    padding: '42px 16px',
    height: '100%',
  },
  btn: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '0px',
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
  caret: {
    width: '30px',
    height: '30px',
    color: theme.extras.variables.colors.ddkRed,
    float: 'right',
  },
}))

const FaqPanel = () => {
  const {
    slideoutPanel,
    slideoutFeature,
    allDataLoaded,
    activeNorm,
    remoteJson,
  } = useStore(
    state => ({
      slideoutPanel: state.slideoutPanel,
      slideoutFeature: state.slideoutFeature,
      allDataLoaded: state.allDataLoaded,
      activeNorm: state.activeNorm,
      remoteJson: state.remoteJson,
    }),
    shallow,
  )

  const classes = styles()

  return (
    <div class={classes.root}>
      <div class={classes.content}>
        <div>
          Frequently Asked Questions
        </div>
        <Button
        className={clsx(
          'faq-toggle',
          classes.btn,
        )}
      >
        <span>How Can I Use This Information</span>
        <FiChevronDown
          className={clsx(
            'faq-btn-caret',
            classes.caret,
          )}
        />
      </Button>
      </div>
    </div>
  )
}

export default FaqPanel
