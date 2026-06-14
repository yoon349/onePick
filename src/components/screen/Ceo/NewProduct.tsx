// NewProduct.tsx
// (기업) 새로운 펀딩 모집 글 작성 화면
// AI 결과가 자동으로 채워진 상태로 진입

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
    Alert, Text, TouchableOpacity, View,
    TextInput, KeyboardAvoidingView, Platform, ScrollView, Image
} from 'react-native';
import FormScrollView from '../../common/FormScrollView';
import { Dropdown } from 'react-native-element-dropdown';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/StackNavigator';
import { styles } from './NewProductStyle';
import { postProduct } from '../../../api/Product/postProduct';
import { filterDigitsOnly, parsePositiveInt } from '../../../utils/numericInput';

import { pickImagesFromLibrary } from '../../../utils/pickImages';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, 'NewProduct'>;
};

const categories = [
    { label: '음식', value: 'FOOD' },
    { label: '가구', value: 'FURNITURE' },
    { label: '전자기기', value: 'DIGITAL' },
    { label: '의류/패션', value: 'FASHION' },
    { label: '미용', value: 'BEAUTY' },
    { label: '기타', value: 'ETC' },
];

export default function NewProduct({ navigation, route }: Props) {

    // AI 결과 파라미터
    const aiPrice = route.params?.aiPrice ?? null;
    const aiDescription = route.params?.aiDescription ?? null;
    const aiProductId = route.params?.aiProductId ?? null;
    const productName = route.params?.productName ?? '';

    const [fulfilled, setFulfilled] = useState(false);
    const [title, setTitle] = useState(productName);
    const [content, setContent] = useState(aiDescription ?? '');
    const [price, setPrice] = useState(aiPrice ? String(aiPrice) : '');
    const [minQuantity, setMinQuantity] = useState('');
    const [deadlineDays, setDeadlineDays] = useState('');
    const [imageMetas, setImageMetas] = useState<any[]>([]);
    const [category, setCategory] = useState('');

    useEffect(() => {
        if (aiPrice == null) {
            navigation.replace('AiProductPriceScreen');
        }
    }, [aiPrice, navigation]);

    useEffect(() => {
        const priceValue = parsePositiveInt(price);
        const minQuantityValue = parsePositiveInt(minQuantity);
        const deadlineValue = parsePositiveInt(deadlineDays);
        const isFilled =
            title.trim() !== '' &&
            content.trim() !== '' &&
            priceValue !== null &&
            minQuantityValue !== null &&
            deadlineValue !== null &&
            category.trim() !== '';
        setFulfilled(isFilled);
    }, [title, content, price, minQuantity, deadlineDays, category]);

    const handleSubmit = async () => {
        try {
            const parsedMinQuantity = parsePositiveInt(minQuantity);
            const parsedDeadlineDays = parsePositiveInt(deadlineDays);
            const submitPrice = aiPrice ?? parsePositiveInt(price);

            if (submitPrice === null || parsedMinQuantity === null || parsedDeadlineDays === null) {
                Alert.alert('입력 오류', '가격, 최소 인원, 마감 기한은 숫자만 입력해 주세요.');
                return;
            }

            let finalImageMetas = imageMetas;

            const body = {
                title,
                content,
                price: submitPrice,
                minQuantity: parsedMinQuantity,
                deadlineDays: parsedDeadlineDays,
                imageMetas:   finalImageMetas,
                category,
                ...(aiProductId ? { productId: aiProductId } : {}),
            };

            console.log(body);
            const result = await postProduct(body);
            console.log(result);

            Alert.alert('✅ 등록 완료', '상품이 성공적으로 등록되었습니다.');
            navigation.goBack();

        } catch (error) {
            if (axios.isAxiosError(error)) {
                Alert.alert('에러 발생', '오류가 발생했습니다.');
            } else {
                Alert.alert('에러 발생', '알 수 없는 오류');
            }
        }
    };

    const handlePickImage = async () => {
        const assets = await pickImagesFromLibrary(1);
        if (assets.length === 0) {
            return;
        }

        const newImages = assets.map((asset) => ({
            uri: asset.uri,
            name: asset.fileName ?? `photo-${Date.now()}.jpg`,
            type: asset.type ?? 'image/jpeg',
        }));
        setImageMetas((prev) => [...prev, ...newImages]);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <FormScrollView contentContainerStyle={styles.scroll}>

                {/* 헤더 */}
                <View style={styles.header}>
                    <View style={styles.btnView}>
                        <TouchableOpacity
                            onPress={() => { navigation.goBack() }}
                            style={styles.backBtn}
                        >
                            <Text style={styles.backIcon}>
                                ←
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerView}>
                        <Text style={styles.headerTitle}>🛒  펀딩 모집 글 작성</Text>
                        <Text style={styles.headerSub}>모집할 상품의 정보를 입력해 주세요</Text>
                    </View>
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

                    <InputField label="제목" placeholder="제목 입력" value={title} onChangeText={setTitle} />
                    <InputField label="상품 설명" placeholder="상품 설명 입력" value={content} onChangeText={setContent} multiline />
                    <InputField label="가격 (AI 산정)" placeholder="AI 분석 후 자동 입력" value={price} onChangeText={(text: string) => setPrice(filterDigitsOnly(text))} numeric />
                    <InputField label="최소 주문 수량" placeholder="최소 주문 수량 입력" value={minQuantity} onChangeText={(text: string) => setMinQuantity(filterDigitsOnly(text))} numeric />
                    <InputField label="마감 기한" placeholder="일 단위 입력" value={deadlineDays} onChangeText={(text: string) => setDeadlineDays(filterDigitsOnly(text))} numeric />

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

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>상품 이미지</Text>
                    <TouchableOpacity style={styles.imageUploadBox} onPress={handlePickImage}>
                        <Text style={styles.imageUploadIcon}>📷</Text>
                        <Text style={styles.imageUploadText}>이미지 업로드</Text>
                        <Text style={styles.imageUploadSub}>최대 1장까지 업로드 가능</Text>
                    </TouchableOpacity>

                    {imageMetas.length > 0 && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.previewRow}>
                            {imageMetas.map((image, index) => (
                                <View key={index} style={styles.previewBox}>
                                    <Image source={{ uri: image.uri }} style={styles.previewImage} />
                                    <TouchableOpacity
                                        style={styles.removeBtn}
                                        onPress={() => setImageMetas(imageMetas.filter((_, i) => i !== index))}
                                    >
                                        <Text style={styles.removeBtnText}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    )}
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

function InputField({ label, placeholder, value, onChangeText, multiline, numeric, editable = true }: any) {
    return (
        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                style={[
                    styles.input,
                    multiline && { height: 100, textAlignVertical: 'top' },
                    !editable && { backgroundColor: '#f0f4ff', color: '#0076F0' },
                ]}
                placeholder={placeholder}
                placeholderTextColor="#aaa"
                value={value}
                onChangeText={onChangeText}
                keyboardType={numeric ? 'number-pad' : 'default'}
                inputMode={numeric ? 'numeric' : undefined}
                multiline={multiline}
                editable={editable}
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
