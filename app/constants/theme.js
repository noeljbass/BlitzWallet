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
  offsetBackground: '#cbcbcb',

  opaicityGray: '#767676b8',
  cancelRed: '#e20000',
};

const FONT = {
  Title_Light: 'Inter-Light',
  Title_Medium: 'Inter-Medium',
  Title_Regular: 'Inter-Regular',
  Title_Bold: 'Inter-Bold',

  Descriptoin_light: 'Lato-Light',
  Descriptoin_Regular: 'Lato-Regular',
  Descriptoin_Bold: 'Lato-Bold',

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
