import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';

import {
  COLORS,
  FONT,
  ICONS,
  SIZES,
  BTN,
  SHADOWS,
  Background,
} from '../../constants';
import {connectToNode} from '../../functions';

export default function CreateAccountHome({navigation: {navigate}}) {
  const handlePress = () => {
    // Action to perform when the button is pressed
    console.log('Button pressed!');
  };

  return (
    <View style={Background}>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar
          backgroundColor={COLORS.background}
          barStyle="dark-content"
        />
        <View style={styles.container}>
          <View style={styles.logo}>
            <Image
              source={ICONS.logoIcon}
              style={{width: '100%', height: '100%'}}
            />
          </View>
          <Text style={styles.title}>Blitz wallet</Text>
          <Text style={styles.sub_title}>
            A non-custodial bitcoin lightning wallet.
          </Text>
          <TouchableOpacity
            style={[BTN, {backgroundColor: COLORS.primary}]}
            onPress={() => {
              navigate('DisclaimerPage');
            }}>
            <Text style={styles.button_full_text}>Create New Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button_empty} onPress={handlePress}>
            <Text style={styles.button_empty_text}>
              Restore Existing Wallet
            </Text>
          </TouchableOpacity>
          <Text style={styles.disclamer_text}>
            Your wallet, your coins, 100% open-source
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    color: COLORS.gray,
    height: '100%',
    width: '100%',
    backgroundColor: COLORS.background,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    padding: 10,
  },
  logo: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.gray,
    marginTop: 'auto',
    marginBottom: 20,
  },
  title: {
    color: COLORS.secondary,
    fontSize: SIZES.huge,
    marginBottom: 10,
    fontFamily: FONT.Title_Regular,
  },
  sub_title: {
    maxWidth: '95%',
    color: COLORS.secondary,
    fontSize: SIZES.large,
    textAlign: 'center',
    fontFamily: FONT.Descriptoin_Regular,
  },
  button_full: {
    backgroundColor: COLORS.primary,
    width: '100%',
    maxWidth: 300,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    borderRadius: 5,
  },
  button_full_text: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontFamily: FONT.Other_Regular,
  },
  button_empty: {
    width: '100%',
    maxWidth: 300,
    marginTop: 30,
  },
  button_empty_text: {
    color: COLORS.primary,
    fontSize: SIZES.large,
    textAlign: 'center',
    fontFamily: FONT.Other_Regular,
  },
  disclamer_text: {
    color: COLORS.black,
    marginTop: 'auto',
    fontFamily: FONT.Descriptoin_Regular,
  },
});
