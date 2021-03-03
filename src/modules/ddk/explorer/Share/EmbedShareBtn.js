import React, { useState, useEffect } from 'react'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import shallow from 'zustand/shallow'
import copy from 'copy-to-clipboard'

import useStore from './../store'
import { IconButton } from '@material-ui/core'
import { FiCode } from 'react-icons/fi'

const EmbedShareBtn = ({ children, ...props }) => {
  const {
    setStoreValues,
    shareHash,
    eventShareEmbed,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      shareHash: state.shareHash,
      eventShareEmbed: state.eventShareEmbed,
    }),
    shallow,
  )

  // Update value for share link only when window object exists.
  const [shareEmbedValue, setShareEmbedValue] = useState('')
  useEffect(() => {
    const linkValue = !!shareHash
      ? window.location.origin +
        window.location.pathname +
        shareHash
      : window.location.origin +
        window.location.pathname +
        DEFAULT_ROUTE

    const embedLink = linkValue.replace('explorer', 'embed')
    const embedValue = `<iframe src="${embedLink}" style="width:720px;height:405px;max-width:100%;" frameborder="0"></iframe>`
    setShareEmbedValue(embedValue)
  }, [shareHash])

  const onCopyEmbed = () => {
    copy(shareEmbedValue)
    setStoreValues({ eventShareEmbed: eventShareEmbed + 1 })
  }

  return (
    <div
      onClick={onCopyEmbed}
      className={clsx(props.className)}
    >
      <IconButton
        label={i18n.translate(`BUTTON_SHARE_EMBED`)}
      >
        <FiCode className="social-icon" />
      </IconButton>
      {children}
    </div>
  )
}

export default EmbedShareBtn
