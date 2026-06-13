// Login.tsx


import React, { useState, useEffect } from 'react';
import { Alert, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/StackNavigator.tsx';
import { postLogin } from '../../../api/Member/postLogin.ts';
import { getApiErrorMessage } from '../../../utils/apiError.ts';
import { styles } from './LoginStyle';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Props = { navigation: HomeScreenNavigationProp; };

export default function Login({ navigation }: Props) {
    const [fulfilled, setFulfilled]     = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        setFulfilled(phoneNumber.trim() !== '');
    }, [phoneNumber]);

    const handleLogin = async () => {
        try {
            const result = await postLogin({ phoneNumber });

            if (!result.success || !result.data) {
                Alert.alert('에러 발생', result.message ?? '로그인 실패');
                return;
            }

            console.log(`${result.data.type === 'CEO' ? '기업' : '개인'}회원 ${result.data.nickname} 님 로그인 성공 !`);
            navigation.navigate('MyPage', { member: result.data });
        } catch (error) {
            Alert.alert('에러 발생', getApiErrorMessage(error, '로그인 실패'));
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.titleBox}>
                    <Text style={styles.title}>
                        함께 사면{"\n"}
                        더 저렴하게
                    </Text>
                    <Text style={styles.subTitle}>
                        공동구매를 시작해 보세요
                    </Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.inputLabel}>휴대폰번호</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="휴대폰번호 입력"
                        placeholderTextColor="#aaa"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />
                </View>
            </View>
            <TouchableOpacity
                disabled={!fulfilled}
                style={[styles.button, !fulfilled && styles.buttonDisabled]}
                onPress={handleLogin}
            >
                <Text style={styles.buttonText}>로그인</Text>
            </TouchableOpacity>
        </View>
    );
}
