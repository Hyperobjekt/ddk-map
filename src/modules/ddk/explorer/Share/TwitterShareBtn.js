import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import TwitterIcon from '@material-ui/icons/Twitter'
import clsx from 'clsx'
import { FiTwitter } from 'react-icons/fi'

import useStore from './../store'
import { onTwitterShare, constructShareLink } from './Share'
import { IconButton } from '@material-ui/core'

const TwitterShareBtn = ({ children, ...props }) => {
  // Generic store value setter.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  const shareHash = useStore(state => state.shareHash)
  // const buttonTooltipPosition = useStore(
  //   state => state.buttonTooltipPosition,
  // )
  const eventShareTwitter = useStore(
    state => state.eventShareTwitter,
  )

  const handleShare = () => {
    onTwitterShare(
      encodeURIComponent(constructShareLink(shareHash)),
      i18n.translate('DIALOG_SHARE_TWITTER'),
    )
    setStoreValues({
      eventShareTwitter: eventShareTwitter + 1,
    })
  }

  return (
    <div
      onClick={handleShare}
      className={clsx(props.className)}
    >
      <IconButton
        label={i18n.translate(`BUTTON_SHARE_TWITTER`)}
      >
        <FiTwitter className="social-icon" />
        <span className="sr-only">
          {i18n.translate(`BUTTON_SHARE_TWITTER`)}
        </span>
      </IconButton>
      {children}
    </div>
  )
}

export default TwitterShareBtn
