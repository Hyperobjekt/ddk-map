import { createMuiTheme } from '@material-ui/core/styles'

export const variables = {
  colors: {
    primary: '#20232a',
    white: '#ffffff',
    bridalHeath: '#fffbf3',
    alabaster: '#f7f7f7',
    oldLace: '#fdf5e9',
    magnolia: '#fbfaff',
    greenWhite: '#ebede3',
    alto: '#d7d7d7',
    boulder: '#757575',
    capeCod: '#3c4748',
    codGray: '#181818',
    dkGray: '#4b4b4b',
    firefly: '#08131f',
    black: '#000000',
    towerGray: '#9dbab7',
    flaxSmoke: '#818967',
    chaletGreen: '#4a6f34',
    turtleGreen: '#2c390b',
    shark: '#292d33',
    cinnabar: '#e94f34',
    orangeRoughy: '#d4441c',
    fog: '#d8ccff',
    deluge: '#7768ae',
    txtLogo: '#8f9287',
    criColor1: '#7b53ef',
    criColor3: '#cabbf5',
    barHighlight: '#e94f34',
    cpLabelColor: '#606b44',
    cpalOrange: '#e55934',
    cpalOrangeLight: '#ffeee5',
  },
  dimensions: {
    navbarHeight: '64px',
    controlPanelWidth: '72px',
    spacer: `0.8rem`,
  },
  breakpoints: [0, 320, 768, 992, 1280],
  fonts: {
    primary: 'halyard-text',
  },
}

export const theme = createMuiTheme({
  // Update theme here according to this documentation
  extras: {
    Legend: {
      width: '200px',
      height: '200px',
      cushionRight: 15,
      cushionTop: 25,
      zIndex: 13,
    },
    controlPanel: {
      width: '72px',
    },
  },
})
