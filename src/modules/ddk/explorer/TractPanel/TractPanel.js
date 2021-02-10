import React, { useState } from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import { Tooltip, Button } from '@material-ui/core'

import useStore from './../store'
import {
  MAIN_INDEX,
  SUB_INDICES,
} from './../../../../constants/map'
import SDScale from './../SDScale'
import { getActiveArray } from './../utils'

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
    activeNorm,
    activeYear,
  } = useStore(state => ({
    slideoutPanel: state.slideoutPanel,
    slideoutTract: state.slideoutTract,
    remoteJson: state.remoteJson,
    allDataLoaded: state.allDataLoaded,
    activeNorm: state.activeNorm,
    activeYear: state.activeYear,
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
      padding: '42px 16px',
    },
    h2: {
      fontWeight: 600,
      fontSize: '20px',
      margin: '0 4px 6px 4px',
    },
    h3: {
      fontWeight: 500,
      fontSize: '14px',
      margin: '0 4px 6px 4px',
      color: theme.extras.variables.colors.lightGray,
    },
    comparedTo: {
      color: theme.extras.variables.colors.ddkRed,
      // textDecoration: 'underline',
      borderBottom: `1px dashed ${theme.extras.variables.colors.ddkRed}`,
      fontSize: '14px',
      fontWeight: 500,
      margin: '6px 4px 8px 4px',
    },
    pad: {
      backgroundColor: theme.extras.variables.colors.white,
      margin: '9px 0',
      padding: '9px',
    },
    metricTitle: {
      fontSize: '18px',
      lineHeight: '24px',
      fontWeight: 600,
      borderBottom: `1px dashed ${theme.extras.variables.colors.darkGray}`,
      margin: '0 0 25px 0',
    },
    sdScale: {
      marginTop: '15px',
    },
    btnParent: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    },
    btn: {
      color: theme.extras.variables.colors.ddkRed,
      marginRight: 0,
      '&.visible': {
        display: 'block',
      },
      '&.hidden': {
        display: 'none',
      },
    },
  }))

  const classes = styles()

  const [showAll, setShowAll] = useState(false)

  const toggleShowAll = () => {
    setShowAll(!showAll)
  }

  const getNormPhrase = () => {
    switch (activeNorm) {
      case 'n':
        return i18n.translate(`SLIDEOUT_THIS_NAT`)
        break
      case 's':
        return i18n.translate(`SLIDEOUT_THIS_STATE`)
        break
      case 'm':
        return i18n.translate(`SLIDEOUT_THIS_METRO`)
        break
      default:
        return i18n.translate(`SLIDEOUT_THIS_NAT`)
    }
  }

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
          {Number(tract.msaid15) === 0 && (
            <h2 className={clsx(classes.h2)}>
              {i18n.translate(`POPUP_CENSUS_TRACT`, {
                id: tract.GEOID,
              })}
            </h2>
          )}
          {Number(tract.msaid15) !== 0 && (
            <>
              <h2 className={clsx(classes.h2)}>
                {i18n.translate(tract.msaid15)}
              </h2>
              <h3 className={clsx(classes.h3)}>
                {i18n.translate(`POPUP_CENSUS_TRACT`, {
                  id: tract.GEOID,
                })}
              </h3>
            </>
          )}
          <div className={clsx('tract-compare-tip')}>
            <Tooltip
              title={i18n.translate(
                `SLIDEOUT_COMPARE_TIP`,
                { normPhrase: getNormPhrase() },
              )}
              arrow
            >
              <span
                className={clsx(
                  'tract-compare-tip',
                  classes.comparedTo,
                )}
                dangerouslySetInnerHTML={{
                  __html: i18n.translate(
                    `SLIDEOUT_COMPARING_TO`,
                    {
                      normPhrase: getNormPhrase(),
                    },
                  ),
                }}
              ></span>
            </Tooltip>
          </div>
          <div
            className={clsx(
              'tract-panel-pad-index',
              classes.pad,
              classes.index,
            )}
          >
            <Tooltip
              title={
                <React.Fragment>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: i18n.translate(
                        `SLIDEOUT_TIP_COI`,
                      ),
                    }}
                  ></span>
                </React.Fragment>
              }
              arrow
            >
              <span
                className={clsx(
                  'slideout-metric-title',
                  classes.metricTitle,
                )}
              >
                {i18n.translate(
                  `${MAIN_INDEX}${activeNorm}`,
                )}
              </span>
            </Tooltip>
            <SDScale
              className={classes.sdScale}
              active={getActiveArray(
                tract[
                  `${MAIN_INDEX}${activeNorm}${activeYear}`
                ],
              )}
            />
          </div>
          <div
            className={clsx(
              'btn-show-all',
              classes.btnParent,
            )}
          >
            <Button
              className={clsx(
                classes.btn,
                !!showAll ? 'hidden' : 'visible',
              )}
              onClick={toggleShowAll}
            >
              {i18n.translate('BTN_SHOW_ALL')}
            </Button>
            <Button
              className={clsx(
                classes.btn,
                !!showAll ? 'visible' : 'hidden',
              )}
              onClick={toggleShowAll}
            >
              {i18n.translate('BTN_HIDE_ALL')}
            </Button>
          </div>
          <div
            className={clsx(
              'tract-panel-pad-subindices',
              classes.pad,
              classes.subindex,
            )}
          >
            {SUB_INDICES.map((el, i) => {
              return (
                <div
                  key={`subindex-${i}`}
                  className={clsx(
                    'tract-panel-pad-subindex',
                    classes.pad,
                    classes.index,
                  )}
                >
                  <Tooltip
                    title={
                      <React.Fragment>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: i18n.translate(
                              `SLIDEOUT_TIP_${el.toUpperCase()}`,
                            ),
                          }}
                        ></span>
                      </React.Fragment>
                    }
                    arrow
                  >
                    <span
                      className={clsx(
                        'slideout-metric-title',
                        classes.metricTitle,
                      )}
                    >
                      {i18n.translate(`${el}${activeNorm}`)}
                    </span>
                  </Tooltip>
                  <SDScale
                    className={classes.sdScale}
                    active={getActiveArray(
                      tract[
                        `${el}${activeNorm}${activeYear}`
                      ],
                    )}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  } else {
    return ''
  }
}

export default TractPanel
