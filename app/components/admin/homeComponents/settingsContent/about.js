import {View, Text, StyleSheet} from 'react-native';
import {COLORS, FONT, SHADOWS, SIZES} from '../../../../constants';
import {useGlobalContextProvider} from '../../../../../context-store/context';

export default function AboutPage() {
  const {theme} = useGlobalContextProvider();

  return (
    <View style={[styles.container]}>
      <View style={styles.innerContainer}>
        <Text
          style={[
            styles.sectionHeader,
            {
              marginTop: 50,
              color: theme ? COLORS.darkModeText : COLORS.lightModeText,
            },
          ]}>
          Software
        </Text>
        <View
          style={[
            styles.contentContainer,
            {
              marginBottom: 30,
              backgroundColor: theme
                ? COLORS.darkModeBackgroundOffset
                : COLORS.lightModeBackgroundOffset,
            },
          ]}>
          <Text
            style={[
              styles.contentText,
              {
                color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                marginBottom: 0,
                textAlign: 'center',
              },
            ]}>
            Blitz is a free and open source app under the Apache License,
            Version 2.0.
          </Text>
        </View>
        <View>
          <Text
            style={[
              styles.sectionHeader,
              {
                color: theme ? COLORS.darkModeText : COLORS.lightModeText,
              },
            ]}>
            Blitz Wallet
          </Text>
          <View
            style={[
              styles.contentContainer,
              {
                backgroundColor: theme
                  ? COLORS.darkModeBackgroundOffset
                  : COLORS.lightModeBackgroundOffset,
              },
            ]}>
            <Text
              style={[
                styles.contentText,
                {
                  color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                },
              ]}>
              This is a{' '}
              <Text style={{color: COLORS.primary}}>SELF-CUSTODIAL</Text>{' '}
              bitcoin lightning wallet. Blitz does not have access to your seed
              phrase. If you lose or share your seed phrase, access to your
              funds may be lost
            </Text>
            <Text
              style={[
                styles.contentText,
                {
                  color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                },
              ]}>
              Blitz uses the Breez SDK to send and receive payments on the
              bitcoin lightning network. The lightning network is still a
              developing protocol so loss of funds can occur.
            </Text>
            <Text
              style={[
                styles.contentText,
                {
                  color: COLORS.cancelRed,
                  textAlign: 'center',
                },
              ]}>
              DO NOT GIVE OUT YOUR 12 WORD SEED PHRASE!
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  innerContainer: {
    width: '90%',
  },

  sectionHeader: {
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.medium,
    marginLeft: 10,
    marginBottom: 10,
  },
  contentContainer: {
    backgroundColor: COLORS.offsetBackground,

    padding: 8,
    borderRadius: 8,
    ...SHADOWS.small,
  },
  contentText: {
    fontFamily: FONT.Descriptoin_Regular,
    marginBottom: 20,
    fontSize: SIZES.medium,
  },
});
