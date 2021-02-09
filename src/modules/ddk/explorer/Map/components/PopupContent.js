import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'

import useStore from './../../store'
import SDScale from './../../SDScale'

const PopupContent = ({ ...props }) => {
  const feature = props.feature
  const {
    activeMetric,
    activeYear,
    activeNorm,
    remoteJson,
  } = useStore(state => ({
    activeMetric: state.activeMetric,
    activeYear: state.activeYear,
    activeNorm: state.activeNorm,
    remoteJson: state.remoteJson,
  }))

  const styles = makeStyles(theme => ({
    root: {
      width: theme.extras.mapPopup.width,
      padding: '16px',
      'font-family': 'Fira Sans',
    },
    title: {
      fontWeight: 600,
      fontSize: '20px',
      lineHeight: '24px',
      letterSpacing: '0.15px',
      color: theme.extras.variables.colors.darkGray,
      // border: '1px solid gray',
      margin: '0 0 3px 0',
    },
    tractId: {
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '14px',
      letterSpacing: '0.25px',
      // border: '1px solid gray',
      margin: '0 0 14px 0',
    },
    hr: {
      height: '1px',
      color: theme.extras.variables.colors.lightLightGray,
      margin: '0 0 12px 0',
    },
    h4: {
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: '24px',
      letterSpacing: '0.1px',
      margin: '0 0 6px 0',
    },
    popWrapper: {
      margin: '10px 0 0 0',
    },
    popItems: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'top',
      margin: '0',
    },
    popItem: {
      flex: '0 0 46%',
      margin: '2px 4% 0px 0px',
      borderBottom: `1px solid ${theme.extras.variables.colors.lightLightGray}`,
      textAlign: 'bottom',
      color: theme.extras.variables.colors.lightGray,
      fontSize: '14px',
      lineHeight: '24px',
      letterSpacing: '0.25px',
      display: 'flex',
      justifyContent: 'space-between',
    },
    SDScale: {
      // display: 'block',
      // margin: '0 0 18px 0',
      // marginBottom: '30px',
      // paddingBottom: '300px',
    },
  }))

  const classes = styles()
  // If no feature or tract data, return.
  if (!feature | !remoteJson | !remoteJson.tracts) {
    return ''
  }
  // Array of all tracts
  const tracts = remoteJson.tracts.data

  const popItems = ['w', 'ai', 'hi', 'ap', 'b']

  const scaleArr = [0, 0, 0, 0, 0]
  scaleArr[
    feature.properties[
      `${activeMetric}${activeNorm}${activeYear}`
    ]
  ] = 1

  return (
    <div className={clsx('popup-parent', classes.root)}>
      {feature.properties.msaid15 !== 0 && (
        <h3
          className={clsx(
            'popup-metro-name',
            classes.title,
          )}
        >
          {i18n.translate(feature.properties.msaid15)}
        </h3>
      )}
      <span
        className={clsx('popup-tract-id', classes.tractId)}
      >
        {i18n.translate(`POPUP_CENSUS_TRACT`, {
          id: feature.id,
        })}
      </span>
      <hr />
      <h4 className={clsx('popup-metric-name', classes.h4)}>
        {i18n.translate(`${activeMetric}${activeNorm}`)}
      </h4>
      <SDScale
        className={clsx(classes.SDScale)}
        active={scaleArr}
      />
      <div
        className={clsx(
          'popup-pop-wrapper',
          classes.popWrapper,
        )}
      >
        <h4
          className={clsx('popup-pop-heading', classes.h4)}
        >
          {i18n.translate(`POPUP_POPULATION`)}
        </h4>
        <div
          className={clsx(
            'popup-pop-items',
            classes.popItems,
          )}
        >
          {popItems.map(el => {
            const tract = tracts.find(tract => {
              return Number(tract.GEOID) === feature.id
            })
            return (
              <div
                className={clsx(
                  'popup-pop-item',
                  classes.popItem,
                )}
              >
                <span
                  className={clsx('popup-pop-item-title')}
                >
                  {i18n.translate(
                    `POP_${el.toUpperCase()}`,
                  )}
                </span>
                <span className="popup-pop-item-data">
                  {tract[`${el}${activeYear}`]}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PopupContent
