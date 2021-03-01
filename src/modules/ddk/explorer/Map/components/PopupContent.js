import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import shallow from 'zustand/shallow'

import useStore from './../../store'
import { getNormPhrase } from './../../utils'
import { FULL_FUNCT_ZOOM_THRESHOLD } from './../../../../../constants/map'

const useStyles = makeStyles(theme => ({
  root: {
    width: `${theme.extras.mapPopup.width}px`,
    padding: '0 6px',
    fontFamily: 'Fira Sans',
    zIndex: '30',
    marginBottom: '-10px',
  },
  title: {
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0.15px',
    color: theme.extras.variables.colors.darkGray,
    margin: '0 0 3px 0',
  },
  tractId: {
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '14px',
    letterSpacing: '0.25px',
    margin: '0 0 14px 0',
    color: theme.extras.variables.colors.lightGray,
  },
  tractIdDark: {
    color: theme.extras.variables.colors.darkGray,
  },
  hr: {
    height: '0.5px',
    color: theme.extras.variables.colors.lightLightGray,
    margin: '0 0 12px 0',
  },
  h4: {
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '24px',
    letterSpacing: '0.1px',
    margin: '0 0 6px 0',
    display: 'flex',
    flexWrap: 'wrap',
  },
  clickPrompt: {
    fontStyle: 'italic',
    fontSize: '12px',
    lineHeight: '12px',
    letterSpacing: '0.25px',
    color: theme.extras.variables.colors.lightGray,
  },
  sdSwatchParent: {
    display: 'flex',
    flex: '1 1 35%',
  },
  metricName: {
    flex: '1 1 65%',
    color: theme.extras.variables.colors.lightGray,
  },
  sdSwatch: {
    width: '19px',
    height: '19px',
    marginRight: '7px',
    // backgroundColor: !!feature
    //   ? theme.extras.SDScale.onColors[
    //       feature.properties[`${activeMetric}${activeNorm}`]
    //     ]
    //   : 'transparent',
    fontSize: '12px',
  },
  comparedTo: {
    width: '100%',
    fontSize: '14px',
    lineHeight: '10px',
    margin: 'auto auto 14px',
    color: theme.extras.variables.colors.lightGray,
  },
}))

const PopupContent = ({ ...props }) => {
  const feature = props.feature
  const {
    activeMetric,
    // activeYear,
    activeNorm,
    // hoveredFeature,
    hoveredTract,
    // remoteJson,
    // langs,
    viewport,
  } = useStore(
    state => ({
      activeMetric: state.activeMetric,
      // activeYear: state.activeYear,
      activeNorm: state.activeNorm,
      // hoveredFeature: state.hoveredFeature,
      hoveredTract: state.hoveredTract,
      // remoteJson: state.remoteJson,
      // langs: state.langs,
      viewport: state.viewport,
    }),
    shallow,
  )

  const classes = useStyles()

  const SDArray = [
    i18n.translate(`SDSCALE_VLOW`),
    i18n.translate(`SDSCALE_LOW`),
    i18n.translate(`SDSCALE_MOD`),
    i18n.translate(`SDSCALE_HIGH`),
    i18n.translate(`SDSCALE_VHIGH`),
  ]

  // If no feature or tract data, return.
  if (hoveredTract === 0) {
    return ''
  }
  // Default array for scale.
  const scaleArr = [0, 0, 0, 0, 0]
  scaleArr[
    feature.properties[`${activeMetric}${activeNorm}`]
  ] = 1

  if (viewport.zoom < FULL_FUNCT_ZOOM_THRESHOLD) {
    // Zoomed out, don't show tract data.
    return (
      <div className={clsx('popup-parent', classes.root)}>
        {activeNorm === 'm' && (
          <p
            className={clsx(
              'popup-prompt-click',
              classes.clickPrompt,
            )}
          >
            {i18n.translate(`POPUP_METRO_PROMPT`)}
          </p>
        )}
        {activeNorm !== 'm' && (
          <p
            className={clsx(
              'popup-prompt-click',
              classes.clickPrompt,
            )}
          >
            {i18n.translate(`POPUP_ZOOM_PROMPT`)}
          </p>
        )}
      </div>
    )
  } else {
    return (
      <div className={clsx('popup-parent', classes.root)}>
        {!!feature && feature.properties.m !== 0 && (
          <h3
            className={clsx(
              'popup-metro-name',
              classes.title,
            )}
          >
            {i18n.translate(feature.properties.m)}
          </h3>
        )}
        <span
          className={clsx(
            'popup-tract-id',
            classes.tractId,
          )}
        >
          {i18n.translate(`POPUP_CENSUS_TRACT`, {
            id: feature.id,
          })}
        </span>
        <hr />
        <div
          className={clsx('popup-metric-name', classes.h4)}
        >
          <div
            className={
              (clsx('popup-metric-name-text'),
              classes.metricName)
            }
          >
            {i18n.translate(
              `LABEL_${String(activeMetric).toUpperCase()}`,
            )}
          </div>
          <div
            className={clsx(
              'popup-metric-swatch-parent',
              classes.sdSwatchParent,
            )}
          >
            <div
              className={clsx(
                'popup-metric-swatch',
                classes.sdSwatch,
              )}
            ></div>
            <div
              className={clsx('popup-metric-block-label')}
            >
              {String(
                SDArray[
                  feature.properties[
                    `${activeMetric}${activeNorm}`
                  ]
                ],
              ).toUpperCase()}
            </div>
          </div>
        </div>
        <div
          className={clsx(
            'compared-to',
            classes.comparedTo,
          )}
        >
          {i18n.translate(`POPUP_COMPARED_TO`, {
            normPhrase: getNormPhrase(activeNorm),
          })}
        </div>
        <p
          className={clsx(
            'popup-prompt-click',
            classes.clickPrompt,
          )}
        >
          {i18n.translate(`POPUP_CLICK_PROMPT`)}
        </p>
      </div>
    )
  }
}

export default PopupContent
