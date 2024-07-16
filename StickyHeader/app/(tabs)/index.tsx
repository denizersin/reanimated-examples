import { Dimensions, FlatList, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import React, { useRef } from 'react';
import Animated, { useSharedValue, interpolate, useAnimatedStyle, useAnimatedScrollHandler, Extrapolation, Extrapolate } from 'react-native-reanimated';


const { width } = Dimensions.get('window');

const CARD_WIDTH = 300;
const CARD_HEIGHT = 300;

export default function TabOneScreen() {

  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      console.log('e', e.contentOffset.x);
      scrollX.value = e.contentOffset.x;
    },
  });

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scrollX.value }]
    }
  })



  const ListItem = ({ text, index }: any) => {
    const animatedStyle = useAnimatedStyle(() => {

      const inputRange = [(index - 1) * CARD_WIDTH, index * CARD_WIDTH, (index + 1) * CARD_WIDTH];

      const translateY = interpolate(scrollX.value, inputRange, [0, -50, 0], 'clamp');

      return {
        transform: [{ translateY }],
      };
    });

    return (
      <Animated.View style={[styles.item, animatedStyle]}>
        <Text style={styles.text}>{text}</Text>
      </Animated.View>
    );
  };




  return (
    <View style={styles.container}>

      <Animated.FlatList
        data={[{ key: 'a' }, { key: 'b' }, { key: 'c' }, { key: 'd' }]}
        horizontal
        contentContainerStyle={{
          gap: 20,
          alignItems: 'center',
        }}
        style={{
          borderWidth: 4,
          borderColor: 'red',
          flexGrow: 0,
          padding: 20,
          height: CARD_HEIGHT + 200,
        }}
        bounces={false}
        snapToInterval={CARD_WIDTH}
        scrollEventThrottle={16}

        onScroll={scrollHandler}

        renderItem={({ item, index }) => <ListItem text={item.key} index={index} />}

      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    width: '80%',
  },
  item: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    marginVertical: 10,
    position: 'relative',
    zIndex: 90,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
