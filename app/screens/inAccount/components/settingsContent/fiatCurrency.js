import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {COLORS, FONT, ICONS, SIZES} from '../../../../constants';
import {
  fetchFiatRates,
  listFiatCurrencies,
} from '@breeztech/react-native-breez-sdk';
import {useEffect, useRef, useState} from 'react';
import {getLocalStorageItem, setLocalStorageItem} from '../../../../functions';
import {backArrow} from '../../../../constants/styles';
import {removeLocalStorageItem} from '../../../../functions/localStorage';

export default function FiatCurrencyPage(props) {
  //   const isInitialRender = useRef(true);
  const [currencies, setCurrencies] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [listData, setListData] = useState([]);
  const [currentCurrency, setCurrentCurrency] = useState('');
  // const props.isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    (async () => {
      const savedCurrencies = await getLocalStorageItem('currenciesList');
      if (savedCurrencies) {
        setCurrencies(JSON.parse(savedCurrencies));
        setListData(JSON.parse(savedCurrencies));
        getCurrentSettings();
        return;
      }
      getCurrencyList();
      getCurrentSettings();

      return;
    })();
  }, []);

  useEffect(() => {
    if (!textInput) {
      setListData(currencies);
      return;
    }
    const filteredList = currencies.filter(currency => {
      if (
        currency.info.name
          .toLowerCase()
          .startsWith(textInput.toLocaleLowerCase())
      )
        return currency;
      else return false;
    });
    setListData(filteredList);
  }, [textInput]);

  function handleKeyPress(e) {
    setTextInput(prev => {
      if (e.nativeEvent?.key.toLowerCase() != 'backspace') {
        return (prev += e.nativeEvent?.key);
      } else {
        const inputLength = prev.length;
        if (inputLength === 1) {
          return '';
        } else {
          const newString = prev.slice(0, inputLength - 1);
          return newString;
        }
      }
    });
  }

  const CurrencyElements = currency => {
    return (
      <TouchableOpacity
        onPress={() => {
          saveCurrencySettings(currency.item.id);
        }}>
        <View
          style={[
            styles.currencyContainer,
            {marginBottom: currency.item.id === 'ZAR' ? 30 : 0},
          ]}>
          <Text
            style={[
              styles.currencyTitle,
              {
                color: props.isDarkMode
                  ? currency.item.id?.toLowerCase() ===
                    currentCurrency?.toLowerCase()
                    ? 'green'
                    : COLORS.darkModeText
                  : currency.item.id?.toLowerCase() ===
                    currentCurrency?.toLowerCase()
                  ? 'green'
                  : COLORS.lightModeText,
              },
            ]}>
            {currency.item.info.name}
          </Text>
          <Text
            style={[
              styles.currencyID,
              {
                color: props.isDarkMode
                  ? currency.item.id?.toLowerCase() ===
                    currentCurrency?.toLowerCase()
                    ? 'green'
                    : COLORS.darkModeText
                  : currency.item.id?.toLowerCase() ===
                    currentCurrency?.toLowerCase()
                  ? 'green'
                  : COLORS.lightModeText,
              },
            ]}>
            {currency.item.id}
          </Text>
          {/* {currency.item.id?.toLowerCase() ===
            currentCurrency?.toLowerCase() && (
            <Image style={{width: 20, height: 20}} source={ICONS.Checkcircle} />
          )} */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        onKeyPress={handleKeyPress}
        style={[
          styles.input,
          {
            backgroundColor: props.isDarkMode
              ? COLORS.darkModeBackgroundOffset
              : COLORS.lightModeBackgroundOffset,

            color: props.isDarkMode
              ? COLORS.darkModeText
              : COLORS.lightModeText,
          },
        ]}
        placeholderTextColor={
          props.isDarkMode ? COLORS.darkModeText : COLORS.lightModeText
        }
        placeholder="Search currency"
      />
      {/* <ScrollView style={{flex: 1, width: '85%', height: '100%'}}> */}
      <FlatList
        style={{flex: 1, width: '90%'}}
        data={listData}
        renderItem={currency => <CurrencyElements {...currency} />}
        keyExtractor={currency => currency.id}
      />
      {/* </ScrollView> */}
    </View>
  );

  async function getCurrencyList() {
    try {
      const currenies = await listFiatCurrencies();

      const sourted = currenies.sort((a, b) => a.id.localeCompare(b.id));
      setLocalStorageItem('currenciesList', JSON.stringify(sourted));

      setCurrencies(sourted);
      setListData(sourted);
    } catch (err) {
      console.log(err);
    }
  }

  async function getCurrentSettings() {
    const currentCurrency = await getLocalStorageItem('currency');

    if (currentCurrency) setCurrentCurrency(currentCurrency);
  }

  async function saveCurrencySettings(selectedCurrency) {
    const didSave = await setLocalStorageItem('currency', selectedCurrency);
    if (didSave) {
      props.setSettingsContent({isDisplayed: false, for: null});
    } else {
      console.log('NOOO');
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  input: {
    width: '95%',
    height: 35,
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 5,

    backgroundColor: COLORS.offsetBackground,
  },

  currencyContainer: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 10,

    borderBottomWidth: 1,
  },

  currencyTitle: {
    fontSize: SIZES.medium,
    fontFamily: FONT.Title_Bold,
  },
  currencyID: {
    fontSize: SIZES.small,
    fontFamily: FONT.Descriptoin_Regular,
  },
});
