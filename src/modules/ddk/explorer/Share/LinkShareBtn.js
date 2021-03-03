import React, { useState, useEffect } from 'react'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import shallow from 'zustand/shallow'
import copy from 'copy-to-clipboard'

import useStore from './../store'
import { IconButton } from '@material-ui/core'
import { FiLink } from 'react-icons/fi'

const LinkShareBtn = ({ children, ...props }) => {
  const {
    setStoreValues,
    shareHash,
    eventShareLink,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      shareHash: state.shareHash,
      eventShareLink: state.eventShareLink,
    }),
    shallow,
  )

  // Update value for share link only when window object exists.
  const [shareLinkValue, setShareLinkValue] = useState('')
  useEffect(() => {
    const linkValue = !!shareHash
      ? window.location.origin +
        window.location.pathname +
        shareHash
      : window.location.origin +
        window.location.pathname +
        DEFAULT_ROUTE

    setShareLinkValue(linkValue)
  }, [shareHash])

  const onCopyLink = () => {
    copy(shareLinkValue)
    setStoreValues({ eventShareLink: eventShareLink + 1 })
  }

  return (
    <div
      onClick={onCopyLink}
      className={clsx(props.className)}
    >
      <IconButton
        label={i18n.translate(`BUTTON_SHARE_LINK`)}
      >
        <FiLink className="social-icon" />
      </IconButton>
      {children}
    </div>
  )
}

export default LinkShareBtn
