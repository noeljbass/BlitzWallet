import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CENTER, COLORS, FONT, SIZES} from '../../../../constants';
import {useEffect, useState} from 'react';
import {useGlobalContextProvider} from '../../../../../context-store/context';

export default function LiquidityIndicator(props) {
  const {nodeInformation, theme} = useGlobalContextProvider();
  const [sendWitdh, setsendWitdh] = useState(0);
  const [showLiquidyAmount, setShowLiquidyAmount] = useState(false);

  useEffect(() => {
    if (
      isNaN(nodeInformation.userBalance) ||
      isNaN(nodeInformation.inboundLiquidityMsat)
    )
      return;
    const calculatedWidth = (
      (nodeInformation.userBalance /
        (nodeInformation.inboundLiquidityMsat / 1000)) *
      150
    ).toFixed(0);
    setsendWitdh(Number(calculatedWidth));
  }, [nodeInformation]);

  return (
    <TouchableOpacity
      onPress={() => {
        setShowLiquidyAmount(prev => !prev);
      }}>
      <View style={styles.container}>
        <Text style={[styles.typeText, {color: COLORS.primary}]}>
          {showLiquidyAmount
            ? props.showAmount
              ? Math.round(nodeInformation.userBalance).toLocaleString()
              : '*****'
            : 'Send'}
        </Text>
        <View
          style={[
            styles.sliderBar,
            {
              backgroundColor: theme
                ? COLORS.lightModeBackground
                : COLORS.darkModeBackground,
            },
          ]}>
          <View
            style={[
              styles.sendIndicator,
              {
                width: isNaN(sendWitdh) ? 0 : sendWitdh,
              },
            ]}></View>
        </View>
        <Text
          style={[
            styles.typeText,
            {
              color: theme
                ? COLORS.lightModeBackground
                : COLORS.darkModeBackground,
            },
          ]}>
          {showLiquidyAmount
            ? props.showAmount
              ? Math.round(
                  nodeInformation.inboundLiquidityMsat / 1000,
                ).toLocaleString()
              : '*****'
            : 'Receive'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...CENTER,
    paddingBottom: 10,
  },

  typeText: {
    width: 'auto',
    fontFamily: FONT.Title_Regular,
    fontSize: SIZES.medium,
    textAlign: 'center',
  },

  sliderBar: {
    height: 8,
    width: 150,

    position: 'relative',
    backgroundColor: 'black',

    marginHorizontal: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },

  sendIndicator: {
    height: '100%',
    // width: 20,
    maxWidth: 110,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
});
