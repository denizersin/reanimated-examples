import React from 'react';
import { Feather } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';

const data = [
  {
    id: 1,
    title: 'Joe Peter',
    image: 'https://picsum.photos/200/300'
  },
  {
    id: 2,
    title: 'Micheal',
    image: 'https://picsum.photos/200/200'
  },
  {
    id: 3,
    title: 'Laura',
    image: 'https://picsum.photos/300/200'
  },
  {
    id: 4,
    title: 'Micheal',
    image: 'https://picsum.photos/200/300'
  }
]

const newData = new Array(20).fill(0).map((_, index) => {
  return data[
    Math.floor(Math.random() * data.length)
  ]
})

const INITIAL_POS_Y_INPUT = -200;

const DELAY_RESET_POSITION = 500;

const CustomScrollView = () => {
  const scrollSv = useSharedValue(0);

  const isAnimateStarted = useSharedValue(false);
  const textScale = useSharedValue(1);

  const textContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: textScale.value }],
  }));

  const scrollViewRef = React.useRef<Animated.ScrollView>(null);

  const scrollEnabledRef = React.useRef(true);

  const scrollY = useSharedValue(0);

  const inputContainerScale = useSharedValue(0);

  const inputContainerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(inputContainerScale.value, [0, 1], [-300, 0])
      }],
    opacity: inputContainerScale.value,
  }));

  const setScrollEnabled = (enabled: boolean) => {
    if (scrollViewRef.current && scrollEnabledRef.current !== enabled) {
      scrollEnabledRef.current = enabled;
      scrollViewRef.current.setNativeProps({
        scrollEnabled: enabled,
      });
    }
  };

  const scrollPanGesture = Gesture.Pan()
    .onUpdate(({ translationY }) => {
      if (scrollY.value > 1) return;

      const clampedValue = clamp(translationY, 0, -INITIAL_POS_Y_INPUT);
      if (scrollSv.value < 20 && translationY > 0) {
        isAnimateStarted.value = true;
        runOnJS(setScrollEnabled)(false);
      }
      if (isAnimateStarted.value) {
        scrollSv.value = clampedValue;

        textScale.value = interpolate(
          clampedValue,
          [0, -INITIAL_POS_Y_INPUT],
          [1, 2],
        );
      }
    })
    .onFinalize(() => {
      const scrollGoBackAnimation = withSpring(0);
      if (isAnimateStarted.value) {
        scrollSv.value = withDelay(DELAY_RESET_POSITION, scrollGoBackAnimation);
        textScale.value = withDelay(DELAY_RESET_POSITION, withSpring(1));
      }
      runOnJS(setScrollEnabled)(true);
    });

  const nativeGesture = Gesture.Native();

  const composedGestures = Gesture.Simultaneous(
    scrollPanGesture,
    nativeGesture,
  );

  const scrollAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollSv.value }],
  }));

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Animated.View style={[textContainerStyle, styles.headerTextContainer]}>
            <Text style={styles.headerText}>
              Header
            </Text>
          </Animated.View>
        </View>

        <Animated.View style={[scrollAnimatedStyle, styles.scrollViewContainer]}>
          <View style={styles.topBarContainer}>
            <Animated.View style={[styles.inputContainer, inputContainerStyle]}>
              <TextInput
                style={styles.input}
                placeholder='Search'
              />
            </Animated.View>
            <AntDesign
              onPress={() => {
                if (inputContainerScale.value === 0)
                  inputContainerScale.value = withTiming(1, { duration: 100 });
                else
                  inputContainerScale.value = withTiming(0, { duration: 100 });
              }}
              name="search1" size={24} color="white" />
            <AntDesign name="plus" size={24} color="white" />
            <Feather name="more-vertical" size={24} color="white" />
          </View>
          <GestureDetector gesture={composedGestures}>
            <Animated.ScrollView
              ref={scrollViewRef}
              bounces={false}
              scrollEventThrottle={16}
              onScroll={scrollHandler}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.contentContainer}
              style={styles.scrollView}>
              {
                newData.map((item, index) => {
                  return (
                    <View key={index} style={styles.itemContainer}>
                      <Text style={styles.itemText}>{item.title}</Text>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.itemImage}
                      />
                    </View>
                  )
                })
              }
            </Animated.ScrollView>
          </GestureDetector>
        </Animated.View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default CustomScrollView;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0c1c35' },
  headerContainer: {
    paddingLeft: 16,
    paddingTop: 16,
  },
  headerTextContainer: {
    transformOrigin: 'top left',
  },
  headerText: {
    color: 'white',
    fontSize: 32,
  },
  scrollViewContainer: {
    flex: 1,
  },
  topBarContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingBottom: 10,
    alignItems: 'center',
  },
  inputContainer: {
    width: 200,
    height: 32,
    marginRight: 'auto',
    overflow: 'hidden',
    transformOrigin: 'left center',
    transform: [{ scale: .1 }],
    marginTop: 5,
    opacity: 0,
  },
  input: {
    width: 200,
    height: 32,
    color: 'black',
    paddingLeft: 10,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    paddingHorizontal: 16,
  },
  itemContainer: {
    width: '50%',
    position: 'relative',
    padding:2
  },
  itemText: {
    color: '#F2F2F2',
    bottom: 30,
    fontSize: 24,
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  itemImage: {
    width: '100%',
    height: 150,
  },
});