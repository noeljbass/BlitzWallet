const COLORS = {
  primary: '#0375F6',
  secondary: '#21374F',
  tertiary: '#009BF0',

  tertiaryBackground: '#EEE5E9',

  gray: '#83829A',
  gray2: '#C1C0C8',

  black: 'black',
  white: 'white',
  lightWhite: '#FAFAFC',

  background: '#F8F8F8',

  lightModeBackground: '#f2f2f2',
  darkModeBackground: '#0d0d0d',

  lightModeText: '#262626',
  darkModeText: '#d9d9d9',

  offsetBackground: '#cbcbcb',
  lightModeBackgroundOffset: '#d9d9d9',
  darkModeBackgroundOffset: '#262626',

  opaicityGray: '#767676b8',
  cameraOverlay: '#0000002e',
  cancelRed: '#e20000',

  connectedNodeColor: '#33cc33',
  notConnectedNodeColor: '#ff0000',
};

const FONT = {
  Title_Light: 'Inter-Light',
  Title_Medium: 'Inter-Medium',
  Title_Regular: 'Inter-Regular',
  Title_Bold: 'Inter-Bold',

  Descriptoin_light: 'Montserrat-Light',
  Descriptoin_Regular: 'Montserrat-Regular',
  Descriptoin_Bold: 'Montserrat-Bold',

  Other_light: 'Montserrat-Light',
  Other_Medium: 'Montserrat-Medium',
  Other_Regular: 'Montserrat-Regular',
  Other_Bold: 'Montserrat-Bold',
};

const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
  huge: 40,
  userSatText: 30,
};

const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

export {COLORS, FONT, SIZES, SHADOWS};
