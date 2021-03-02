import React from 'react'
import {
  Drawer,
  Typography,
  Link,
  IconButton,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import shallow from 'zustand/shallow'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { fade, makeStyles } from '@material-ui/core/styles'

import useStore from './../store'

const styles = makeStyles(theme => ({
  root: {
    width: '351px',
    position: 'relative',
  },
  close: {
    position: 'absolute',
    top: '10px',
    right: '10px',
  },
  nav: {
    marginTop: '50px',
  },
  ul: {
    listStyleType: 'none',
    paddingInlineStart: 0,
  },
  section: {
    listStyleType: 'none',
    padding: '16px 0',
    margin: '0 16px',
    borderTop: '1px solid #ccc',
    '&:first-of-type': {
      borderTop: 0,
    },
  },
  item: {},
  link: {
    fontFamily: 'Fira Sans',
    fontSize: '18px',
    lineHeight: '48px',
    letterSpacing: '0.25px',
    textDecoration: 'none',
    fontWeight: 600,
    color: theme.extras.variables.colors.ddkNavy,
    '&:hover': {
      borderBottom: `3px solid ${theme.extras.variables.colors.ddkRed}`,
    },
  },
  linkActive: {
    borderBottom: `3px solid ${theme.extras.variables.colors.ddkRed}`,
  },
}))

const Menu = () => {
  const { showMenu, toggleShowMenu } = useStore(
    state => ({
      showMenu: state.showMenu,
      toggleShowMenu: state.toggleShowMenu,
    }),
    shallow,
  )

  const classes = styles()
  // Fetch menu items.
  const menu = i18n.translate(`MENU`)

  return (
    <Drawer
      anchor={'right'}
      open={showMenu}
      onClose={toggleShowMenu}
    >
      <div className={clsx('nav-menu', classes.root)}>
        <IconButton
          aria-label={i18n.translate(`MENU_CLOSE`)}
          className={clsx('nav-menu-close', classes.close)}
          onClick={toggleShowMenu}
        >
          <CloseIcon />
        </IconButton>
        <nav className={clsx('nav-menu', classes.nav)}>
          <ul
            className={clsx(
              'nav-menu-sections',
              classes.ul,
            )}
          >
            {menu.map((section, i) => {
              return (
                <ul
                  key={`menu-section-${i}`}
                  className={clsx(
                    'nav-menu-section',
                    classes.section,
                  )}
                >
                  {section.map((link, ind) => {
                    return (
                      <li
                        key={`menu-link-${i}${ind}`}
                        className={clsx(
                          'nav-menu-item',
                          classes.item,
                        )}
                      >
                        <a
                          href={link.link}
                          aria-label={link.label}
                          className={clsx(
                            'nav-menu-link',
                            classes.link,
                            !!link.active
                              ? classes.linkActive
                              : '',
                          )}
                        >
                          {link.label}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              )
            })}
          </ul>
        </nav>
      </div>
    </Drawer>
  )
}

export default Menu
