import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import { FiMail } from 'react-icons/fi'
import { IconButton } from '@material-ui/core'

import useStore from './../store'

import { onMailShare, constructShareLink } from './Share'

const MailShareBtn = ({ children, ...props }) => {
  // Generic store value setter.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  const shareHash = useStore(state => state.shareHash)
  // const buttonTooltipPosition = useStore(
  //   state => state.buttonTooltipPosition,
  // )
  const eventShareEmail = useStore(
    state => state.eventShareEmail,
  )

  const handleShare = () => {
    onMailShare(
      encodeURIComponent(constructShareLink(shareHash)),
      i18n.translate('DIALOG_SHARE_EMAIL'),
    )
    setStoreValues({
      eventShareEmail: eventShareEmail + 1,
    })
  }

  return (
    <div
      onClick={handleShare}
      className={clsx(props.className)}
    >
      <IconButton
        label={i18n.translate(`BUTTON_SHARE_EMAIL`)}
      >
        <FiMail className="social-icon" />
        <span className="sr-only">
          {i18n.translate(`BUTTON_SHARE_EMAIL`)}
        </span>
      </IconButton>
      {children}
    </div>
  )
}

export default MailShareBtn
