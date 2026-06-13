import React, { useState, useEffect } from 'react';
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
  Platform,
  InputAccessoryView,
  Button,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/StackNavigator';
import { postLogin } from '../../../api/Member/postLogin';
import { getApiErrorMessage } from '../../../utils/apiError';
import { SessionNotReadyError } from '../../../api/axios';
import OnePickLogo from '../../brand/OnePickLogo';
import SafeScreen from '../../common/SafeScreen';
import { styles } from './LoginStyle';

const PHONE_INPUT_ACCESSORY_ID = 'phone-input-accessory';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function Login({ navigation }: Props) {
  const [fulfilled, setFulfilled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFulfilled(phoneNumber.trim() !== '');
  }, [phoneNumber]);

  const handleLogin = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await postLogin({ phoneNumber });

      if (!result.success || !result.data) {
        Alert.alert('에러 발생', result.message ?? '로그인 실패');
        return;
      }

      navigation.replace('MyPage', { member: result.data });
    } catch (error) {
      if (error instanceof SessionNotReadyError) {
        Alert.alert('세션 오류', error.message);
        return;
      }
      Alert.alert('에러 발생', getApiErrorMessage(error, '로그인 실패'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeScreen style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.topAccent} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 6 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoWrap}>
            <OnePickLogo symbolSize={80} wordmarkSize={32} />
          </View>

          <Text style={styles.slogan}>함께 사면,{'\n'}더 좋은 선택</Text>
          <Text style={styles.subSlogan}>판매자와 구매자를 연결하는 공동구매 플랫폼</Text>

          <View style={styles.card}>
            <Text style={styles.inputLabel}>휴대폰번호</Text>
            <TextInput
              style={styles.input}
              placeholder="01012345678"
              placeholderTextColor="#9AA8B8"
              keyboardType="phone-pad"
              inputAccessoryViewID={
                Platform.OS === 'ios' ? PHONE_INPUT_ACCESSORY_ID : undefined
              }
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          <TouchableOpacity
            disabled={!fulfilled || isSubmitting}
            style={[styles.button, (!fulfilled || isSubmitting) && styles.buttonDisabled]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>{isSubmitting ? '로그인 중...' : '로그인'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={PHONE_INPUT_ACCESSORY_ID}>
          <View style={styles.inputAccessory}>
            <Button title="완료" onPress={Keyboard.dismiss} />
          </View>
        </InputAccessoryView>
      )}
    </SafeScreen>
  );
}
