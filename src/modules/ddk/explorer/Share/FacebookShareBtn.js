import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import { FiFacebook } from 'react-icons/fi'
import clsx from 'clsx'

import useStore from './../store'
import {
  onFacebookShare,
  constructShareLink,
} from './Share'
import { IconButton } from '@material-ui/core'

const FacebookShareBtn = ({ children, ...props }) => {
  // Generic store value setter.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  const shareHash = useStore(state => state.shareHash)
  // const buttonTooltipPosition = useStore(
  //   state => state.buttonTooltipPosition,
  // )
  const eventShareFacebook = useStore(
    state => state.eventShareFacebook,
  )

  const handleShare = () => {
    onFacebookShare(
      encodeURIComponent(constructShareLink(shareHash)),
      // i18n.translate('DIALOG_SHARE_FACEBOOK'),
    )
    setStoreValues({
      eventShareFacebook: eventShareFacebook + 1,
    })
  }

  return (
    <div
      onClick={handleShare}
      className={clsx(props.className)}
    >
      <IconButton
        label={i18n.translate(`BUTTON_SHARE_FACEBOOK`)}
      >
        <FiFacebook className="social-icon" />
        <span className="sr-only">
          {i18n.translate(`BUTTON_SHARE_FACEBOOK`)}
        </span>
      </IconButton>
      {children}
    </div>
  )
}

export default FacebookShareBtn
