import React from 'react'
import i18n from '@pureartisan/simple-i18n'
import AppBar from '@material-ui/core/AppBar'
import { Button, Typography } from '@material-ui/core'
import Toolbar from '@material-ui/core/Toolbar'
import { fade, makeStyles } from '@material-ui/core/styles'
import shallow from 'zustand/shallow'

import useStore from './../store'
import GeocodeSearch from './../GeocodeSearch'
import { HamburgerIcon } from './../../../assets/Icons'
import { ddkLogoSvg } from './../../../assets/img'
import { PARENT_SITE } from './../../../../constants/map'

// Styles for component.
const useHeaderStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.extras.variables.colors.white,
    fontFamily: `'Fira Sans', helvetica, arial`,
    color: 'black',
    boxShadow: 'none',
    [theme.breakpoints.up('sm')]: {
      boxShadow:
        '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
    },
  },
  icon: {
    height: '24px',
    width: '24px',
    marginRight: '0.5rem',
  },
  h1: {
    fontSize: '1.2rem',
    backgroundImage: `url(${ddkLogoSvg})`,
    width: '186px',
    height: '33px',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
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
  mobileGate: {
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  menuButton: {
    textTransform: 'none',
    fontFamily: 'Fira Sans',
    fontSize: '10px',
    fontWeight: 600,
    width: '38px',
    marginLeft: '4px',
    boxSizing: 'borderBox',
    color: theme.extras.variables.colors.darkGray,
    '& .MuiButton-label': {
      display: 'flex',
      flexWrap: 'wrap',
    },
    '& svg': {
      width: '20px',
      height: '20px',
      flex: '0 0 100%',
      '& path': {
        stroke: theme.extras.variables.colors.darkGray,
      },
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: '14px',
      width: 'auto',
      '& .MuiButton-label': {
        display: 'flex',
        flexWrap: 'nowrap',
      },
      '& svg': {
        marginRight: '8px',
        width: '24px',
        height: '24px',
        flex: '0 0 auto',
      },
    },
  },
  search: {
    marginRight: theme.spacing(1),
    marginLeft: 'auto',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: 'auto',
      marginRight: theme.spacing(1),
      width: `${theme.extras.autoSuggest.width}px`,
    },
  },
}))

const Header = ({ ...props }) => {
  // Header is not displayed if the view type is 'embed'
  const { activeView, toggleShowMenu } = useStore(
    state => ({
      activeView: state.activeView,
      toggleShowMenu: state.toggleShowMenu,
    }),
    shallow,
  )

  const toggleMenu = () => {
    // console.log('toggleMenu()')
    toggleShowMenu()
  }

  const classes = useHeaderStyles()

  if (activeView === 'embed') {
    return ''
  } else {
    return (
      <AppBar className={classes.root}>
        <Toolbar>
          <a href={PARENT_SITE}>
            <Typography
              className={classes.h1}
              variant="h1"
              aria-label={i18n.translate('SITE_TITLE')}
            ></Typography>
          </a>
          <GeocodeSearch classes={classes.search} />
          <Button
            className={classes.menuButton}
            onClick={toggleMenu}
          >
            <HamburgerIcon />
            <span>{i18n.translate(`BTN_MENU`)}</span>
          </Button>
        </Toolbar>
      </AppBar>
    )
  }
}

Header.propTypes = {}

Header.defaultProps = {}

export default Header
