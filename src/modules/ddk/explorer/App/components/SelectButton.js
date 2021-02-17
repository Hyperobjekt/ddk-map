import React from 'react'
import { InputLabel, Select, MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const SelectButton = ({...props}) => {

const styles = makeStyles(theme => ({
    root: {
        width: '100%',
        display: 'block',
    },
    label:{
        fontFamily: 'Fira Sans',
        fontWeight: '400',
        fontSize: '12px',
        color: '#616161',
        width: '100%',

    },
    select: {
        width: '100%',
    },
    item: {
        width: '100%',
    },
    outlined: {
        borderRadius: '2px',
        padding: '6px 14px 6px 32px',
    },
    iconOutlined: {
        left: '7px',
    }
}))

const classes = styles()

return (
    <div className={classes.root}>
        <label className={classes.label} id="selectLabel">{props.label}</label>
        <Select
            labelId="selectLabel"
            classes={{root: classes.root, outlined: classes.outlined, iconOutlined: classes.iconOutlined}}
            variant="outlined"
            className={classes.select}
            value={props.current}
            onChange={props.handleChange}
            IconComponent={ExpandMoreIcon}
        >
            {props.options.map((el, i) => {
                return <MenuItem className={classes.item} value={el.val} key={`item-${i}`}>
                    {el.display}
                </MenuItem>
            })}
        </Select>
    </div>
)
}

SelectButton.propTypes = {
    options: PropTypes.array,
    label: PropTypes.string,
    current: PropTypes.string,
    handleChange: PropTypes.func,
}

export default SelectButton