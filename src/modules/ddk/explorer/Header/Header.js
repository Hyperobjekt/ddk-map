import React from 'react'
import i18n from '@pureartisan/simple-i18n'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Toolbar from '@material-ui/core/Toolbar'
import { MdHome } from 'react-icons/md'
import { makeStyles } from '@material-ui/core/styles'

import useStore from './../store'
import theme from './../theme'

const Header = ({ ...props }) => {
  // Header is not displayed if the view type is 'embed'
  const activeView = useStore(state => state.activeView)

  // Styles for component.
  const headerStyles = makeStyles({
    root: {
      // Any overrides...
    },
    icon: {
      height: '24px',
      width: '24px',
      marginRight: '0.5rem',
    },
    h1: {
      fontSize: '1.2rem',
    },
  })

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
        </Toolbar>
      </AppBar>
    )
  }
}

Header.propTypes = {}

Header.defaultProps = {}

export default Header
