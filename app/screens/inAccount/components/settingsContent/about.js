import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {COLORS, FONT, SHADOWS, SIZES} from '../../../../constants';

export default function AboutPage() {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={[styles.sectionHeader, {marginTop: 50}]}>Software</Text>
        <View style={[styles.contentContainer, {marginBottom: 30}]}>
          <Text>
            Blitz is a free and open source app under the _________ license.
          </Text>
        </View>
        <View>
          <Text style={styles.sectionHeader}>Blitz Wallet</Text>
          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>
              This is a{' '}
              <Text style={{color: COLORS.primary}}>NON-CUSTODIAL</Text> wallet.
              Blitz does not have any access to your keys so if you lose them
              you lose your money.
            </Text>
            <Text style={styles.contentText}>
              Blitz uses the Breez SDK to send and recive payments on the
              bitcoin lightning network. The lightning network is still a
              developing protocol so loss of funds can occur.
            </Text>
            <Text style={styles.contentText}>
              Beware of phishing emials.{' '}
              <Text style={{color: COLORS.cancelRed}}>
                DO NOT GIVE OUT YOUR 12 WORD SEED PHRASE.
              </Text>
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
