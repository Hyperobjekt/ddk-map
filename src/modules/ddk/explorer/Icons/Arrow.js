import React from 'react'
import PropTypes from 'prop-types'

const Arrow = ({...props}) => {
  return(
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        <circle cx="16" cy="16" r="11.5" stroke={ props.disabled ? props.colorDisabled : props.color }/>
      </g>
      <path d="M18 11L12.1818 16.8182L18 22.6364" stroke={ props.disabled ? props.colorDisabled : props.color } strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <filter id="filter0_d" x="0" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
          <feOffset/>
          <feGaussianBlur stdDeviation="2"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
      </defs>
    </svg>
  )
}

Arrow.propTypes = {
  color: PropTypes.string,
  colorDisabled: PropTypes.string,
  disabled: PropTypes.bool
}

Arrow.defaultProps = {
  color: '#C9422C',
  colorDisabled: '#616161',
  disabled: true
}

export default Arrow