import React from 'react'
import { InputLabel, Select, MenuItem, Icon } from '@material-ui/core';
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const SelectBox = ({...props}) => {

const styles = makeStyles(theme => ({
    root: {
        width: '100%',
        display: 'block',
        fontFamily: 'Fira Sans',
        position: 'relative',
        color: theme.extras.variables.colors.darkGray
    },
    label:{
        display: 'block',
        position: 'relative',
        fontSize: '12px',
        color: '#616161',
        width: '100%',
        paddingBottom: '3px'
    },
    select: {
        width: '100%',
        fontSize: '14px',
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
    },
    help: {
        position: 'absolute',
        right: '5px',
        marginTop: '5px',
        fontSize: '18px',
        color: '#616161',
        zIndex: '1',
    }
}))

const classes = styles()

return (
    <div className={classes.root}>
        <label className={classes.label} id="selectLabel">{props.label}</label>
        {props.showHelp && 
            <Icon className={classes.help} component={HelpOutlineIcon}></Icon>
        }
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

SelectBox.propTypes = {
    options: PropTypes.array,
    label: PropTypes.string,
    current: PropTypes.string,
    handleChange: PropTypes.func,
    showHelp: PropTypes.bool
}

export default SelectBox