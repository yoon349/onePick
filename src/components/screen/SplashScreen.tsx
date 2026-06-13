import React, { useEffect, useRef } from 'react';
import { Animated, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/StackNavigator';
import OnePickLogo from '../brand/OnePickLogo';
import SafeScreen from '../common/SafeScreen';
import { styles } from './SplashScreenStyle';

type SplashNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;
type Props = { navigation: SplashNavigationProp };

const SPLASH_DURATION_MS = 4000;

export default function SplashScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation, slideAnim]);

  return (
    <SafeScreen style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.topAccent} />

      <View style={styles.content}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            alignItems: 'center',
          }}
        >
          <Animated.Text style={styles.slogan}>함께 사면, 더 좋은 선택</Animated.Text>

          <View style={styles.logoWrap}>
            <OnePickLogo />
          </View>
        </Animated.View>
      </View>

      <Animated.View style={[styles.footer, { bottom: insets.bottom + 24, opacity: fadeAnim }]}>
        <Animated.Text style={styles.subText}>
          판매자와 구매자를 연결하는 공동구매 플랫폼
        </Animated.Text>
      </Animated.View>
    </SafeScreen>
  );
}
