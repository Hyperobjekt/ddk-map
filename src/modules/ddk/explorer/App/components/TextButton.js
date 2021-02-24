import React from 'react'
import { ButtonBase } from '@material-ui/core';
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const TextButton = ({...props}) => {

const styles = makeStyles(theme => ({
    root: {
        width: '100%',
        display: 'block',
        fontFamily: 'Fira Sans',
        position: 'relative'
    }
}))

const classes = styles()

return (
    <div>
      <ButtonBase>
        {props.children}
      </ButtonBase>
    </div>
)
}

TextButton.propTypes = {
    options: PropTypes.array,
    label: PropTypes.string,
    current: PropTypes.string,
    handleChange: PropTypes.func,
    showHelp: PropTypes.bool
}

export default TextButton