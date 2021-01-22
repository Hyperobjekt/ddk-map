import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'

import useStore from './../store'
import { IconButton } from '@material-ui/core'
import EmailIcon from '@material-ui/icons/Email'
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
        <EmailIcon className="social-icon" />
        <span className="sr-only">
          {i18n.translate(`BUTTON_SHARE_EMAIL`)}
        </span>
      </IconButton>
      {children}
    </div>
  )
}

export default MailShareBtn
