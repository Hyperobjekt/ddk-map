import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'

import useStore from './../store'
import { IconButton } from '@material-ui/core'
import CodeIcon from '@material-ui/icons/Code'

const EmbedShareBtn = ({ children, ...props }) => {
  // Generic store value setter.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )

  const openModal = () => {
    setStoreValues({
      shareEmbedModal: true,
    })
  }

  return (
    <div
      onClick={openModal}
      className={clsx(props.className)}
    >
      <IconButton
        label={i18n.translate(`BUTTON_SHARE_EMBED`)}
      >
        <CodeIcon className="social-icon" />
        <span className="sr-only">
          {i18n.translate(`BUTTON_SHARE_EMBED`)}
        </span>
      </IconButton>
      {children}
    </div>
  )
}

export default EmbedShareBtn
