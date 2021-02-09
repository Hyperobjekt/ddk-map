import React from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'

import useStore from './../store'

/**
 * Displays contents specific to a tract (for display in slideout
 * panel or modal dialog)
 */
const TractPanel = () => {
  const {
    slideoutPanel,
    slideoutTract,
    remoteJson,
    allDataLoaded,
  } = useStore(state => ({
    slideoutPanel: state.slideoutPanel,
    slideoutTract: state.slideoutTract,
    remoteJson: state.remoteJson,
    allDataLoaded: state.allDataLoaded,
  }))

  // Styles for this component.
  const styles = makeStyles(theme => ({
    root: {
      width: '100%',
      height: '100%',
      'font-family': 'Fira Sans',
      backgroundColor:
        theme.extras.variables.colors.lightLightGray,
    },
    content: {
      padding: '42px 2rem 2rem 2rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '20px',
    },
  }))

  const classes = styles()

  if (
    slideoutPanel.panel === 'tract' &&
    allDataLoaded &&
    !!remoteJson &&
    !!remoteJson.tracts
  ) {
    const tracts = remoteJson.tracts.data
    const tract = tracts.find(tract => {
      return Number(tract.GEOID) === slideoutTract
    })
    // if (!!tract) {
    //   console.log('slideout tract is ', tract)
    // }
    return (
      <div
        className={clsx('tract-panel-parent', classes.root)}
      >
        <div
          className={clsx(
            'tract-panel-contents',
            classes.content,
          )}
        >
          <h2 className={clsx(classes.h2)}>
            {i18n.translate(tract.msaid15)}
          </h2>
          <h3>
            {i18n.translate(`POPUP_CENSUS_TRACT`, {
              id: tract.GEOID,
            })}
          </h3>
        </div>
      </div>
    )
  } else {
    return ''
  }
}

export default TractPanel
