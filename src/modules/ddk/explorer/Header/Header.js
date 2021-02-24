import React from 'react'
import i18n from '@pureartisan/simple-i18n'
import AppBar from '@material-ui/core/AppBar'
import { Button, Typography } from '@material-ui/core'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Toolbar from '@material-ui/core/Toolbar'
import { MdHome, MdSearch } from 'react-icons/md'
import { makeStyles } from '@material-ui/core/styles'

import useStore from './../store'
import GeocodeSearch from './../GeocodeSearch'
import { HamburgerIcon } from './../../../core/Icons'

const Header = ({ ...props }) => {
  // Header is not displayed if the view type is 'embed'
  const activeView = useStore(state => state.activeView)

  // Styles for component.
  const headerStyles = makeStyles(theme => ({
    root: {
      backgroundColor: theme.extras.variables.colors.white,
      fontFamily: `'Fira Sans', helvetica, arial`,
      color: 'black',
    },
    icon: {
      height: '24px',
      width: '24px',
      marginRight: '0.5rem',
    },
    h1: {
      fontSize: '1.2rem',
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
    menuButton: {
      textTransform: 'none',
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
          <GeocodeSearch />
          <Button className={classes.menuButton}>
            <HamburgerIcon />
            {i18n.translate(`BTN_MENU`)}
          </Button>
        </Toolbar>
      </AppBar>
    )
  }
}

Header.propTypes = {}

Header.defaultProps = {}

export default Header
