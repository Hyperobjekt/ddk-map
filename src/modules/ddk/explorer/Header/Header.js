import React from 'react'
import i18n from '@pureartisan/simple-i18n'
import AppBar from '@material-ui/core/AppBar'
import { InputBase, Typography } from '@material-ui/core'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Toolbar from '@material-ui/core/Toolbar'
import { MdHome, MdSearch } from 'react-icons/md'
import { fade, makeStyles } from '@material-ui/core/styles'

import useStore from './../store'
import theme from './../theme'

const Header = ({ ...props }) => {
  // Header is not displayed if the view type is 'embed'
  const activeView = useStore(state => state.activeView)

  // Styles for component.
  const headerStyles = makeStyles(theme => ({
    root: {
      backgroundColor: theme.extras.variables.colors.white,
    },
    icon: {
      height: '24px',
      width: '24px',
      marginRight: '0.5rem',
    },
    h1: {
      fontSize: '1.2rem',
    },
    search: {
      position: 'relative',
      minWidth: '320px',
      border: `1px solid ${theme.extras.variables.colors.lightLightGray}`,
      color: theme.extras.variables.colors.lightGray,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(
        theme.palette.common.white,
        0.15,
      ),
      '&:hover': {
        backgroundColor: fade(
          theme.palette.common.white,
          0.25,
        ),
      },
      marginRight: theme.spacing(1),
      marginLeft: 'auto',
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: 'auto',
        marginRight: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      right: 0,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: theme.spacing(2),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }))

  const classes = headerStyles()

  if (activeView === 'embed') {
    return ''
  } else {
    return (
      <AppBar className={classes.root}>
        <Toolbar>
          <MdHome className={classes.icon} />
          <Typography className={classes.h1} variant="h1">
            {i18n.translate('SITE_TITLE')}
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <MdSearch />
            </div>
            <InputBase
              placeholder={i18n.translate('SEARCH_PROMPT')}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
        </Toolbar>
      </AppBar>
    )
  }
}

Header.propTypes = {}

Header.defaultProps = {}

export default Header
