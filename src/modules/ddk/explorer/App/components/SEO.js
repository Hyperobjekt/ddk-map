import React from 'react'
import { Helmet } from 'react-helmet'
import i18n from '@pureartisan/simple-i18n'
import shallow from 'zustand/shallow'

import useStore from './../../store'
import {
  BASE_URL,
  FB_APP_ID,
} from './../../../../../constants/map'
import {
  shareImage,
  favicon,
} from './../../../../assets/img'

const SEO = () => {
  const { activeLang, shareHash } = useStore(
    state => ({
      activeLang: state.activeLang,
      shareHash: state.shareHash,
    }),
    shallow,
  )

  return (
    <Helmet>
      <html lang={activeLang} />
      <meta charSet="utf-8" />
      <title>{i18n.translate(`SITE_TITLE`)}</title>
      <link rel="canonical" href={BASE_URL} />
      <link
        rel="icon"
        type="image/png"
        href={favicon}
        sizes="16x16"
      />
      <meta
        name="description"
        content={i18n.translate(`SITE_DESCRIPTION`)}
      />
      <meta
        name="keywords"
        content={i18n.translate(`SITE_KEYWORDS`)}
      />
      <meta
        name="og:title"
        content={i18n.translate(`SITE_TITLE`)}
      />
      <meta
        name="og:description"
        content={i18n.translate(`SITE_DESCRIPTION`)}
      />
      <meta name="og:type" content={`website`} />
      <meta
        name="og:image"
        content={`${BASE_URL}${String(shareImage).replace(
          '/',
          '',
        )}`}
      />
      <meta
        name="og:url"
        content={`${BASE_URL}${shareHash}`}
      />
      <meta name="fb:app_id" content={FB_APP_ID} />

      <meta
        name="twitter:creator"
        content={i18n.translate(`MAP_AUTHOR`)}
      />
      <meta
        name="twitter:title"
        content={i18n.translate(`SITE_TITLE`)}
      />
      <meta
        name="twitter:description"
        content={i18n.translate(`SITE_DESCRIPTION`)}
      />
      <meta
        name="twitter:image"
        content={`${BASE_URL}${String(shareImage).replace(
          '/',
          '',
        )}`}
      />
      <meta
        name="twitter:card"
        content="summary_large_image"
      />
    </Helmet>
  )
}

export default SEO
