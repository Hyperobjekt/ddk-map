/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react'
import GenericShareModal from './GenericShareModal'
import i18n from '@pureartisan/simple-i18n'
import useStore from './../store'

const ShareEmbedModal = props => {
  // Generic store value setter.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  const open = useStore(state => state.shareEmbedModal)
  const onClose = () => {
    setStoreValues({ shareEmbedModal: false })
  }

  return (
    <GenericShareModal
      open={open}
      onClose={onClose}
      heading={i18n.translate('MODAL_SHARE_EMBED_HEAD')}
      showEmbedSection={true}
    />
  )
}

export default ShareEmbedModal
