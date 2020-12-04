import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'

import useStore from './../store'
import { IconButton } from '@material-ui/core'
import LinkIcon from '@material-ui/icons/Link'

const LinkShareBtn = ({ children, ...props }) => {
  // Generic store value setter.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  const shareHash = useStore(state => state.shareHash)
  const buttonTooltipPosition = useStore(
    state => state.buttonTooltipPosition,
  )
  const shareLinkModal = useStore(
    state => state.shareLinkModal,
  )
  const handleShare = () => {
    setStoreValues({
      shareLinkModal: !shareLinkModal,
    })
  }

  return (
    <div
      onClick={handleShare}
      className={clsx(props.className)}
    >
      <IconButton
        label={i18n.translate(`BUTTON_SHARE_LINK`)}
      >
        <LinkIcon className="social-icon" />
        <span className="sr-only">
          {i18n.translate(`BUTTON_SHARE_LINK`)}
        </span>
      </IconButton>
      {children}
    </div>
  )
}

export default LinkShareBtn
