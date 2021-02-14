import React, { useState } from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import { Tooltip, Button } from '@material-ui/core'

// Styles for this component.
const styles = makeStyles(theme => ({
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
}))

const PopStack = ({ ...props }) => {
  // console.log('PopStack, ', props.pop['w'])
  // Capture classes.
  const classes = styles()
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
            className={clsx('pop-item', classes.popItem)}
            key={`popup-item-${i}`}
          >
            <span className={clsx('pop-item-title')}>
              {i18n.translate(`POP_${el.toUpperCase()}`)}
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
