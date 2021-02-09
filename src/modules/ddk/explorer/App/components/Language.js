import React, { useEffect } from 'react'
import i18n from '@pureartisan/simple-i18n'

import useStore from './../../store'

/**
 * This component manages the language set.
 * If the active language or the language set
 * are updated, it re-initializes the translation object.
 */
const Language = ({ ...props }) => {
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  // Language management.
  const activeLang = useStore(state => state.activeLang)
  const langs = useStore(state => state.langs)
  const setLang = useStore(state => state.setLang)

  // Initializes the languages in use.
  const initLang = () => {
    // console.log('initLang')
    i18n.init({
      locale: activeLang,
      languages: langs,
    })
  }
  useEffect(() => {
    // console.log('change to languages. re-initializing.')
    initLang()
  }, [activeLang, langs])

  if (!!props.lang) {
    setStoreValues({
      activeLang: props.lang,
    })
  }
  let lang
  if (!!props.langSet) {
    setLang(props.langSet)
  }
  initLang()

  return ''
}

export default Language
