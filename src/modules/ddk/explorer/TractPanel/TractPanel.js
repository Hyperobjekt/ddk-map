import React, { useState } from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import {
  Tooltip,
  CircularProgress,
} from '@material-ui/core'
import shallow from 'zustand/shallow'

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
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    'font-family': 'Fira Sans',
    backgroundColor:
      theme.extras.variables.colors.lightLightGray,
  },
  content: {
    padding: '42px 16px 0px',
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  },
  h2: {
    fontWeight: 600,
    fontSize: '20px',
    margin: '0 4px 6px 4px',
  },
  h3: {
    marginBlockStart: '0',
    marginBlockEnd: '0.25rem',
  },
  section: {
    marginTop: '1rem',
    '&:first-of-type': {
      marginTop: 0,
    },
  },
  popTitle: {
    fontWeight: 600,
    fontSize: '16px',
    margin: '0 4px 6px 4px',
    borderBottom: `1px dashed ${theme.extras.variables.colors.darkGray}`,
  },
  dataTitle: {
    fontWeight: 600,
    fontSize: '18px',
    margin: '0 4px 12px 0',
    borderBottom: `1px dashed ${theme.extras.variables.colors.darkGray}`,
  },
  subtitle: {
    fontWeight: 500,
    fontSize: '14px',
    margin: '0 4px 6px 4px',
    color: theme.extras.variables.colors.lightGray,
  },
  compareParent: {
    margin: '6px 4px 6px 4px',
  },
  comparedTo: {
    color: theme.extras.variables.colors.ddkRed,
    borderBottom: `1px dashed ${theme.extras.variables.colors.ddkRed}`,
    fontSize: '14px',
    fontWeight: 500,
  },
  popStack: {
    margin: '8px 4px 8px 4px',
    width: '95%',
    '& .pop-item': {
      borderBottom: `1px solid ${theme.extras.variables.colors.lighterGray}`,
    },
  },
  pad: {
    backgroundColor: theme.extras.variables.colors.white,
    margin: '9px 0',
    padding: '14px 9px 9px 9px',
  },
  metricTitle: {
    fontSize: '16px',
    lineHeight: '16px',
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
  tractScrollGroup: {
    overflowY: 'scroll',
    flexGrow: '1',
  },
  spinner: {
    margin: '6rem auto',
  },
  rootNoData: {
    display: 'flex',
  },
}))

/**
 * Displays contents specific to a tract (for display in slideout
 * panel or modal dialog)
 */
const TractPanel = () => {
  // console.log('TractPanel')
  const {
    slideoutPanel,
    slideoutFeature,
    allDataLoaded,
    activeNorm,
    remoteJson,
    activeYear,
  } = useStore(
    state => ({
      slideoutPanel: state.slideoutPanel,
      slideoutFeature: state.slideoutFeature,
      allDataLoaded: state.allDataLoaded,
      activeNorm: state.activeNorm,
      remoteJson: state.remoteJson,
      activeYear: state.activeYear,
    }),
    shallow,
  )

  const classes = useStyles()

  const [showSubs, setShowSubs] = useState([1, 0, 0])

  const toggleShowSubs = () => {
    // console.log('toggleShowSubs')
    if (showSubs.every(item => item === 1)) {
      // console.log('all shown')
      setShowSubs([0, 0, 0])
    } else {
      // console.log('some shown')
      setShowSubs([1, 1, 1])
    }
  }

  const toggleSub = i => {
    console.log('toggleSub')
    const subsSlice = showSubs.slice()
    subsSlice[i] = subsSlice[i] === 1 ? 0 : 1
    setShowSubs(subsSlice)
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

  const getNormlyPhrase = () => {
    switch (activeNorm) {
      case 'n':
        return i18n.translate(`SLIDEOUT_THIS_NATLY`)
        break
      case 's':
        return i18n.translate(`SLIDEOUT_THIS_STATELY`)
        break
      case 'm':
        return i18n.translate(`SLIDEOUT_THIS_METROLY`)
        break
      default:
        return i18n.translate(`SLIDEOUT_THIS_NATLY`)
    }
  }

  if (
    slideoutPanel.panel === 'tract' &&
    allDataLoaded &&
    !!slideoutFeature &&
    !!remoteJson &&
    !!remoteJson.pop &&
    !!remoteJson.raw
  ) {
    // const tracts = remoteJson.tracts.data
    const feature = slideoutFeature
    // Population feature data
    const pop = remoteJson.pop.data.find(el => {
      return Number(el.GEOID) === feature.id
    })
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
          <div
            className="geo"
            className={clsx(
              'section',
              'section-geo',
              classes.section,
            )}
          >
            {Number(feature.properties.m) === 0 && (
              <>
                <h2 className={clsx(classes.h2)}>
                  {i18n.translate(`POPUP_CENSUS_TRACT`, {
                    id: feature.id,
                  })}
                </h2>
                <h3 className={clsx(classes.subtitle)}>
                  {i18n.translate(`DATA_YEAR_PHRASE`, {
                    year: '20' + activeYear,
                  })}
                </h3>
              </>
            )}
            {Number(feature.properties.m) !== 0 && (
              <>
                <h2 className={clsx(classes.h2)}>
                  {i18n.translate(feature.properties.m)}
                </h2>
                <h3 className={clsx(classes.subtitle)}>
                  {i18n.translate(`SLIDEOUT_CENSUS_TRACT`, {
                    id: feature.id,
                    yearPhrase: i18n.translate(
                      `DATA_YEAR_PHRASE`,
                      {
                        year: '20' + activeYear,
                      },
                    ),
                  })}
                </h3>
              </>
            )}
          </div>
          <div
            className={clsx(
              'section',
              'section-pop',
              classes.section,
            )}
          >
            <h3 className={clsx(classes.h3)}>
              <Tooltip
                title={i18n.translate(
                  `SLIDEOUT_CHILDREN_TIP`,
                )}
                arrow
              >
                <span className={clsx(classes.popTitle)}>
                  {i18n.translate(`SLIDEOUT_CHILDREN`)}
                </span>
              </Tooltip>
            </h3>

            <PopStack
              classes={clsx(classes.popStack)}
              pop={pop}
            />
          </div>
          <div
            className={clsx(
              'section',
              'section-data',
              classes.section,
            )}
          >
            <h2 className={clsx(classes.h2)}>
              <Tooltip
                title={i18n.translate(
                  `SLIDEOUT_HEADING_LEVELS_TIP`,
                )}
                arrow
              >
                <span className={clsx(classes.dataTitle)}>
                  {i18n.translate(
                    `SLIDEOUT_HEADING_LEVELS`,
                  )}
                </span>
              </Tooltip>
            </h2>
            <div
              className={clsx(
                'tract-compare-tip',
                classes.compareParent,
              )}
            >
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
                        normlyPhrase: getNormlyPhrase(),
                      },
                    ),
                  }}
                ></span>
              </Tooltip>
            </div>
            <div
              className={clsx(
                'tract-panel-scroll-group',
                classes.tractScrollGroup,
              )}
            >
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
                    role="heading"
                    aria-level="4"
                    className={clsx(
                      'slideout-metric-title',
                      classes.metricTitle,
                    )}
                  >
                    {i18n.translate(`SLIDEOUT_HEADING_XC`)}
                  </span>
                </Tooltip>
                <SDScale
                  className={classes.sdScale}
                  active={getActiveArray(
                    feature.properties[
                      `${MAIN_INDEX}${activeNorm}`
                    ],
                  )}
                />
              </div>
              <div
                className={clsx(
                  'tract-panel-pad-subindices',
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
                          role="heading"
                          aria-level="4"
                          className={clsx(
                            'slideout-metric-title',
                            classes.metricTitle,
                          )}
                        >
                          {i18n.translate(
                            `SLIDEOUT_HEADING_${String(
                              el,
                            ).toUpperCase()}`,
                          )}
                        </span>
                      </Tooltip>
                      <SDScale
                        className={classes.sdScale}
                        active={getActiveArray(
                          feature.properties[
                            `${el}${activeNorm}`
                          ],
                        )}
                      />
                      <IndicatorList
                        subindex={el}
                        isOpen={showSubs[i] === 1}
                        toggleSub={toggleSub}
                        subIndex={i}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div
        className={clsx(
          'tract-panel-parent',
          classes.root,
          classes.rootNoData,
        )}
      >
        <CircularProgress
          color="primary"
          className={clsx(
            'tract-panel-spinner',
            classes.spinner,
          )}
        />
      </div>
    )
  }
}

export default TractPanel
