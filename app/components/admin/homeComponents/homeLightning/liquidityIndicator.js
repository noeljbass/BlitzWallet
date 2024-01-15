import {StyleSheet, Text, View} from 'react-native';
import {CENTER, COLORS, FONT, SIZES} from '../../../../constants';
import {useEffect, useState} from 'react';
import {nodeInfo} from '@breeztech/react-native-breez-sdk';

export default function LiquidityIndicator(props) {
  const [sendWitdh, setsendWitdh] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const {channelsBalanceMsat, inboundLiquidityMsats} = await nodeInfo();
        const calculatedWidth = (
          (channelsBalanceMsat /
            (channelsBalanceMsat + inboundLiquidityMsats)) *
          200
        ).toFixed(0);
        setsendWitdh(Number(calculatedWidth));
      } catch (err) {
        console.log(err);
      }
    })();
  }, [props.breezInformation]);
  return (
    <View style={styles.container}>
      <Text style={[styles.typeText, {color: COLORS.primary}]}>Send</Text>
      <View
        style={[
          styles.sliderBar,
          {
            backgroundColor: props.theme
              ? COLORS.lightModeBackground
              : COLORS.darkModeBackground,
          },
        ]}>
        <View
          style={[
            styles.sendIndicator,
            {
              width: sendWitdh,
            },
          ]}></View>
      </View>
      <Text
        style={[
          styles.typeText,
          {
            color: props.theme
              ? COLORS.lightModeBackground
              : COLORS.darkModeBackground,
          },
        ]}>
        Receive
      </Text>
    </View>
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
    width: 200,

    position: 'relative',
    backgroundColor: 'black',

    marginHorizontal: 10,
    borderRadius: 8,
  },

  sendIndicator: {
    height: '100%',
    // width: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
});
