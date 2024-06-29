import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    Easing,

} from 'react-native-reanimated';
import { View, Text, Button, StyleSheet, ScrollView, Platform, useAnimatedValue, LayoutChangeEvent } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { waitFor } from '@/constants/utils';

type Props = {}
type TCalculatedMaskValues = ({
    w: number,
    h: number,
} | null)[];

const strings = [
    "Hi",
    "This is Reanimated",
    "I am a text",
    "I am also look cool",
    "on andriod devices",
]

const EXIT_ANIM_DURATION = 200,
    ENTER_ANIM_DURATION = 200,
    WIDTH_HEIGHT_ANIM_DURATION = 500;

const Page = (props: Props) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [maskIndex, setMaskIndex] = useState(0);

    const [calculatedMaskValues, setcalculatedMaskValues] =
        useState<TCalculatedMaskValues>(new Array(strings.length).fill(null));

    const animatedTextWdith = useSharedValue(40);
    const animatedTextHeight = useSharedValue(40);
    const animatedTextX = useSharedValue(0);
    const amitedTextScale = useSharedValue(1);
    const animatedOpacity = useSharedValue(1);


    const animatedTextStyles = useAnimatedStyle(() => {
        return {
            width: animatedTextWdith.value,
            height: animatedTextHeight.value,
            opacity: animatedOpacity.value,
            transform: [
                { translateX: animatedTextX.value, },
                { scale: amitedTextScale.value, }
            ]

        }
    });

    async function masIndexEffect() {
        setExitAnim();
        await waitFor(EXIT_ANIM_DURATION)
        setCurrentTextIndex(maskIndex);
        await waitFor(1000)
        setEnterAnim();
        setActualWidthHeight();
    }

    useEffect(() => {
        masIndexEffect();
    }, [maskIndex]);


    useEffect(() => {
        const interval = setInterval(() => {
            setMaskIndex((prev) => {
                if (prev === strings.length - 1) { return 0; }
                else { return prev + 1; }
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    function setExitAnim() {
        animatedOpacity.value = withTiming(0, {
            duration: EXIT_ANIM_DURATION,
        });
        animatedTextX.value = withTiming(-10, {
            duration: EXIT_ANIM_DURATION,
        });
        animatedTextWdith.value = withTiming(0, {
            duration: EXIT_ANIM_DURATION,
        });
        amitedTextScale.value = withTiming(.8, {
            duration: EXIT_ANIM_DURATION,
            easing: Easing.linear,
        });
    }

    function setEnterAnim() {
        animatedOpacity.value = withTiming(1, {
            duration: 0,
        });
        animatedTextX.value = withTiming(0, {
            duration: ENTER_ANIM_DURATION,
        });
        amitedTextScale.value = withTiming(1, {
            duration: ENTER_ANIM_DURATION,
            easing: Easing.linear,
        });
    }

    function setActualWidthHeight() {
        animatedTextWdith.value = withTiming(calculatedMaskValues[maskIndex]?.w || 0, {
            duration: WIDTH_HEIGHT_ANIM_DURATION,
        });
        animatedTextHeight.value = withTiming(calculatedMaskValues[maskIndex]?.h || 0, {
            duration: WIDTH_HEIGHT_ANIM_DURATION,
        });
    }

    return (
        <SafeAreaView
            style={styles.safeArea}>
            <Animated.Text
                style={[styles.text, animatedTextStyles]}>
                {strings[currentTextIndex]}
            </Animated.Text>
            <View
                style={styles.masksContainer}>
                {
                    strings.map((text, index) => (
                        <Text
                            key={index}
                            onLayout={(event) => {
                                const { width, height } = event.nativeEvent.layout;
                                setcalculatedMaskValues((prev) => {
                                    const copy = prev.slice();
                                    copy[index] = { w: width, h: height };
                                    return copy;
                                });
                            }}
                            style={[
                                styles.mask,
                            ]}
                        >
                            {text}
                        </Text>
                    ))
                }
            </View>


        </SafeAreaView>
    )
}

export default Page


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        alignItems: 'flex-start',
        paddingTop: 100,
        paddingLeft: 10,
        backgroundColor: 'black',
    },
    textContainer: {
        borderWidth: 1,
        borderColor: 'blue',
        marginTop: 100,
        marginLeft: 100,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',

    },
    text: {
        fontSize: 32,
        borderColor: 'blue',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    masksContainer: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        position: 'absolute',
        zIndex: -1,
        opacity: 0,
    },

    mask: {
        fontSize: 32,
        borderWidth: 1,
        borderColor: 'red',
        padding: 10,
    }
})


//! order cycle   1.useEffect 2.onLayout