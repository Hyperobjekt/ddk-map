import React, { useState } from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'

// Styles for this component.
const useStyles = makeStyles(theme => ({
  popWrapper: {
    margin: '10px 0 0 0',
  },
  popItems: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'top',
    margin: '6px 0 0 4px',
  },
  popItem: {
    flex: '0 0 30%',
    margin: '2px 4% 0px 0px',
    borderBottom: `1px solid ${theme.extras.variables.colors.lightLightGray}`,
    textAlign: 'bottom',
    color: theme.extras.variables.colors.lightGray,
    fontSize: '13px',
    lineHeight: '22px',
    letterSpacing: '0.25px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  popItemLong: {
    flex: '0 0 62%',
  },
}))

const PopStack = ({ ...props }) => {
  // console.log('PopStack, ', props.pop['w'])
  // Capture classes.
  const classes = useStyles()
  // Population items.
  const popItems = ['w', 'ai', 'hi', 'ap', 'b']

  return (
    <div
      className={clsx(
        'pop-items',
        props.classes,
        classes.popItems,
      )}
    >
      {popItems.map((el, i) => {
        return (
          <div
            className={clsx(
              'pop-item',
              classes.popItem,
              el === 'ai' || el == 'ap'
                ? classes.popItemLong
                : '',
            )}
            key={`popup-item-${i}`}
          >
            <span className={clsx('pop-item-title')}>
              {i18n
                .translate(
                  `POP_LONG_${String(el).toUpperCase()}`,
                )
                .indexOf('missing') < 0
                ? i18n.translate(
                    `POP_LONG_${String(el).toUpperCase()}`,
                  )
                : i18n.translate(
                    `POP_${String(el).toUpperCase()}`,
                  )}
            </span>
            <span className="pop-item-data">
              {props.pop[el]}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default PopStack
