import { createMuiTheme } from '@material-ui/core/styles'

export const variables = {
  colors: {
    primary: '#20232a',
    white: '#ffffff',
    darkGray: '#03171C',
    lightGray: '#616161',
    ddkRed: '#C9422C',
    lighterGray: '#D3D3D3',
    lightLightGray: '#eee',
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
    ddkBlue: '#013457',
    ddkLightRed: 'rgba(201, 66, 44, 0.1)',
    ddkLightRedHex: 'rgba(248, 231, 229, 1)',
    ddkNavy: '#045781',
    ddkAnotherNavy: `#3B5998`,
    ddkAnotherGray: `#5E5E5E`,
    ddkAnotherOneOffBlue: `#1DA1F2`,
    ddkALighterOneOffBlue: `rgba(29,161,242,0.1)`,
  },
  dimensions: {
    navbarHeight: '64px',
    controlPanelWidth: '72px',
    spacer: `0.8rem`,
  },
  breakpoints: [0, 320, 768, 992, 1280],
  fonts: {
    primary: 'Fira Sans',
  },
}

/** "on" colors for color scale */
export const onColors = [
  '#C9E8F8',
  '#8DD4F9',
  '#73A0C9',
  '#588DA8',
  '#56778D',
]

export const theme = createMuiTheme({
  // Update theme here according to the Mui documentation
  palette: {
    primary: {
      main: '#6200EE',
      dark: '#3700B3',
    },
    secondary: {
      main: '#03DAC5', //Another orange-ish color
      dark: '#018786',
    },
    error: {
      main: '#B00020',
    },
  },
  overrides: {
    // '&$selected': {
    //   backgroundColor: variables.colors.ddkLightRed,
    // },
    MuiTooltip: {
      // Arrow styling.
      arrow: {
        color: variables.colors.black,
      },
      // Tooltip body and contents.
      tooltipArrow: {
        backgroundColor: variables.colors.black,
        fontSize: '14px',
        padding: '16px',
      },
    },
    MuiButtonBase: {
      root: {
        '&:hover': {
          backgroundColor: variables.colors.ddkLightRed,
        },
      },
    },
    MuiIconButton: {
      root: {
        '&:hover': {
          backgroundColor: variables.colors.ddkLightRed,
        },
      },
    },
    MuiListItem: {
      button: {
        '&$selected, &$selected:hover': {
          backgroundColor: variables.colors.ddkLightRed,
        },
        '&:hover': {
          backgroundColor: variables.colors.ddkLightRed,
        },
      },
    },
  },
  extras: {
    Legend: {
      width: '252px',
      cushionRight: 15,
      cushionTop: 25,
      zIndex: 13,
      height: 295,
    },
    controlPanel: {
      width: '72px',
      zIndex: 15,
    },
    slideoutPanel: {
      width: '416px',
      zIndex: 10,
    },
    sharePopper: {
      width: 320,
    },
    mapPopup: {
      width: 287,
      height: 220,
      edgePadding: 100,
      offset: 50,
    },
    introModal: {
      buttonWidth: 288,
    },
    autoSuggest: {
      width: 338,
    },
    variables: variables,
    SDScale: {
      offColors: [
        'rgba(201, 232, 248, 0.3)',
        'rgba(115, 160, 201, 0.3)',
        'rgba(141, 212, 249, 0.3)',
        'rgba(88, 141, 168, 0.3)',
        'rgba(86, 119, 141, 0.3)',
      ],
      onColors: onColors,
    },
    demos: {
      ai: '#FF00CC',
      ap: '#FF730C',
      b: '#FFC31A',
      hi: '#7401B1',
      w: '#66CC00',
    },
  },
})
