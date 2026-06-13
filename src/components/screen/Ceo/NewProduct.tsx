// NewProduct.tsx
// (기업) 새로운 펀딩 모집 글 작성 화면
// AI 결과가 자동으로 채워진 상태로 진입

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
    Alert, Text, TouchableOpacity, View,
    TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import FormScrollView from '../../common/FormScrollView';
import { Dropdown } from 'react-native-element-dropdown';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/StackNavigator';
import { styles } from './NewProductStyle';
import { postProduct } from '../../../api/Product/postProduct';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
    route:      RouteProp<RootStackParamList, 'NewProduct'>;
};

const categories = [
    { label: '음식',      value: 'FOOD' },
    { label: '가구',      value: 'FURNITURE' },
    { label: '전자기기',  value: 'DIGITAL' },
    { label: '의류/패션', value: 'FASHION' },
    { label: '미용',      value: 'BEAUTY' },
    { label: '기타',      value: 'ETC' },
];

export default function NewProduct({ navigation, route }: Props) {

    // AI 결과 파라미터
    const aiPrice       = route.params?.aiPrice ?? null;
    const aiDescription = route.params?.aiDescription ?? null;
    const aiProductId   = route.params?.aiProductId ?? null;
    const productName   = route.params?.productName ?? '';

    const [fulfilled, setFulfilled]       = useState(false);
    const [title, setTitle]               = useState(productName);
    const [content, setContent]           = useState(aiDescription ?? '');
    const [price, setPrice]               = useState(aiPrice ? String(aiPrice) : '');
    const [minPeople, setMinPeople]       = useState('');
    const [deadlineDays, setDeadlineDays] = useState('');
    const [category, setCategory]         = useState('');

    useEffect(() => {
        const isFilled =
            title.trim() !== '' &&
            content.trim() !== '' &&
            price.trim() !== '' &&
            minPeople.trim() !== '' &&
            deadlineDays.trim() !== '' &&
            category.trim() !== '';
        setFulfilled(isFilled);
    }, [title, content, price, minPeople, deadlineDays, category]);

    const handleSubmit = async () => {
        try {
            const body = {
                title,
                content,
                price:        Number(price),
                minPeople:    Number(minPeople),
                deadlineDays: Number(deadlineDays),
                category,
                ...(aiProductId ? { productId: aiProductId } : {}),
            };

            console.log(body);
            const result = await postProduct(body);
            console.log(result);

            Alert.alert('등록 완료', '상품이 성공적으로 등록되었습니다.');
            navigation.goBack();

        } catch (error) {
            if (axios.isAxiosError(error)) {
                Alert.alert('에러 발생', JSON.stringify(error.response?.data) || error.message);
            } else {
                Alert.alert('에러 발생', '알 수 없는 오류');
            }
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <FormScrollView contentContainerStyle={styles.scroll}>

                {/* 헤더 */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>🛒 공동구매 글 작성</Text>
                    <Text style={styles.headerSub}>상품 정보를 확인하고 입력해 주세요</Text>
                </View>

                {/* AI 결과 배너 */}
                {aiPrice && (
                    <View style={aiBannerStyle}>
                        <Text style={aiBannerTextStyle}>
                            ✅ AI 적정가격 분석 완료 — {aiPrice.toLocaleString()}원
                        </Text>
                    </View>
                )}

                {/* 상품 정보 */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📦 상품 정보</Text>

                    <InputField label="제목"      placeholder="제목 입력"      value={title}        onChangeText={setTitle} />
                    <InputField label="상품 설명" placeholder="상품 설명 입력" value={content}      onChangeText={setContent} multiline />
                    <InputField label="가격"      placeholder="가격 입력"      value={price}        onChangeText={setPrice} keyboardType="numeric" />
                    <InputField label="최소 인원" placeholder="최소 인원 입력" value={minPeople}    onChangeText={setMinPeople} keyboardType="numeric" />
                    <InputField label="마감 기한" placeholder="일 단위 입력"   value={deadlineDays} onChangeText={setDeadlineDays} keyboardType="numeric" />

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>카테고리</Text>
                        <Dropdown
                            style={styles.dropdown}
                            containerStyle={styles.dropdownContainer}
                            placeholderStyle={styles.dropdownPlaceholder}
                            selectedTextStyle={styles.dropdownSelectedText}
                            itemTextStyle={styles.dropdownItemText}
                            data={categories}
                            labelField="label"
                            valueField="value"
                            placeholder="카테고리를 선택하세요"
                            value={category}
                            onChange={item => setCategory(item.value)}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    disabled={!fulfilled}
                    style={[styles.button, !fulfilled && styles.buttonDisabled]}
                    onPress={handleSubmit}
                >
                    <Text style={styles.buttonText}>완료</Text>
                </TouchableOpacity>

            </FormScrollView>
        </KeyboardAvoidingView>
    );
}

function InputField({ label, placeholder, value, onChangeText, keyboardType, multiline }: any) {
    return (
        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                style={[styles.input, multiline && { height: 100, textAlignVertical: 'top' }]}
                placeholder={placeholder}
                placeholderTextColor="#aaa"
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                multiline={multiline}
            />
        </View>
    );
}

const aiBannerStyle = {
    backgroundColor: '#d1fae5', borderRadius: 12,
    padding: 14, marginBottom: 16, alignItems: 'center' as const,
};
const aiBannerTextStyle = {
    fontSize: 14, fontWeight: '700' as const, color: '#065f46',
};
