import {COLORS, SHADOWS} from './theme';

const CENTER = {marginRight: 'auto', marginLeft: 'auto'};

const BTN = {
  width: '100%',
  maxWidth: 300,
  height: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 50,
  borderRadius: 5,
  ...SHADOWS.small,
};

const Background = {
  flex: 1,
  backgroundColor: COLORS.background,
};
export {CENTER, BTN, Background};
