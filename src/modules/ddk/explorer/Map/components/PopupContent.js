import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'

const PopupContent = ({ ...props }) => {
  const feature = props.feature
  console.log('feature, ', feature)
  if (!feature) {
    return ''
  }
  const styles = makeStyles(theme => ({
    root: {
      width: theme.extras.mapPopup.width,
      padding: '0 16px 16px 16px',
      'font-family': 'Fira Sans',
    },
    title: {
      // 'font-family': 'Fira Sans Medium',
      'font-weight': 500,
      fontSize: '20px',
      lineHeight: '24px',
      letterSpacing: '0.15px',
    },
  }))

  const classes = styles()

  return (
    <div className={clsx('popup-parent', classes.root)}>
      <h3 className={clsx(classes.title)}>
        {i18n.translate(feature.properties.msaid15)}
      </h3>
      <span className={clsx('popup-parent', classes.root)}>
        feature ID
      </span>
      <hr />
      <p>Index</p>
      <p>Population data</p>
    </div>
  )
}

export default PopupContent
