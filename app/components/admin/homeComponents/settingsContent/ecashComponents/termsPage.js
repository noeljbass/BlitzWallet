import {useNavigation} from '@react-navigation/native';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {BTN, COLORS, FONT, ICONS, SIZES} from '../../../../../constants';
import {useGlobalContextProvider} from '../../../../../../context-store/context';

export default function TermsPage() {
  const navigate = useNavigation();
  const {theme} = useGlobalContextProvider();

  return (
    <View
      style={[
        styles.globalContainer,
        {
          backgroundColor: theme
            ? COLORS.darkModeBackground
            : COLORS.lightModeBackground,
          paddingVertical: Platform.OS === 'ios' ? 0 : 10,
        },
      ]}>
      <View style={[styles.contentContainer]}>
        <View style={[styles.contentItem]}>
          <Text
            style={[
              styles.contentHeader,
              {color: theme ? COLORS.darkModeText : COLORS.lightModeText},
            ]}>
            What is this?
          </Text>
          <View
            style={[
              styles.contentDescriptionContainer,
              {
                backgroundColor: theme
                  ? COLORS.darkModeBackgroundOffset
                  : COLORS.lightModeBackgroundOffset,
                paddingBottom: 0,
              },
            ]}>
            <Text
              style={[
                styles.contentDescription,
                {color: theme ? COLORS.darkModeText : COLORS.lightModeText},
              ]}>
              DESCRIPTION
            </Text>
          </View>
        </View>
        <View style={[styles.contentItem]}>
          <Text
            style={[
              styles.contentHeader,
              {color: theme ? COLORS.darkModeText : COLORS.lightModeText},
            ]}>
            Importent to know?
          </Text>
          <View
            style={[
              styles.contentDescriptionContainer,
              {
                backgroundColor: theme
                  ? COLORS.darkModeBackgroundOffset
                  : COLORS.lightModeBackgroundOffset,
              },
            ]}>
            <Text
              style={[
                styles.contentDescription,
                {
                  color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                  marginBottom: 0,
                },
              ]}>
              DESCRIPTION
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => Alert.alert('Coming soon...')}
          style={[
            BTN,
            {
              backgroundColor: COLORS.primary,
              marginTop: 'auto',
              marginBottom: 0,
            },
          ]}>
          <Text style={styles.buttonText}>Agree</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    marginTop: 10,
  },

  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarIcon: {
    width: 25,
    height: 25,
  },
  topBarText: {
    fontSize: SIZES.large,
    marginRight: 'auto',
    marginLeft: 'auto',
    transform: [{translateX: -12.5}],
    fontFamily: FONT.Title_Bold,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  contentItem: {
    width: '90%',
    marginVertical: 10,
  },
  contentHeader: {
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.medium,
    marginBottom: 10,
  },
  contentDescriptionContainer: {
    padding: 10,
    borderRadius: 8,
  },
  contentDescription: {
    fontFamily: FONT.Descriptoin_Regular,
    fontSize: SIZES.medium,
    marginBottom: 10,
  },

  buttonText: {
    color: COLORS.white,
    fontFamily: FONT.Other_Regular,
  },
});
