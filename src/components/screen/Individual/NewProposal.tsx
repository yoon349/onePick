// NewProposal.tsx
// (개인) 구매 요청 글 작성
// 탭 1: 이미지 업로드 / 탭 2: 스케치

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
    Alert,
    Text,
    Image,
    TouchableOpacity,
    View,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { pickImagesFromLibrary } from '../../../utils/pickImages';

import FormScrollView from '../../common/FormScrollView';
import { Dropdown } from 'react-native-element-dropdown';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/StackNavigator';
import { styles } from './NewProposalStyle';
import { postProposal } from '../../../api/Proposal/postProposal';
import { filterDigitsOnly, parsePositiveInt } from '../../../utils/numericInput';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Props = {
    navigation: HomeScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'NewProposal'>;
};
type TabType = 'image' | 'sketch';

const categories = [
    { label: '음식',      value: 'FOOD' },
    { label: '가구',      value: 'FURNITURE' },
    { label: '전자기기',  value: 'DIGITAL' },
    { label: '의류/패션', value: 'FASHION' },
    { label: '미용',      value: 'BEAUTY' },
    { label: '기타',      value: 'ETC' },
];

export default function NewProposal({ navigation, route }: Props) {

    const [activeTab, setActiveTab]       = useState<TabType>('image');
    const [fulfilled, setFulfilled]       = useState(false);
    const [title, setTitle]               = useState('');
    const [content, setContent]           = useState('');
    const [category, setCategory]         = useState('');
    const [maxPrice, setMaxPrice]         = useState('');
    const [deadlineDays, setDeadlineDays] = useState('');
    const [imageMetas, setImageMetas]     = useState<any[]>([]);
    const [sketchB64, setSketchB64]       = useState<string | null>(null);
    const [prompt, setPrompt]             = useState('');

    useEffect(() => {
        if (route.params?.sketchB64) {
            setSketchB64(route.params.sketchB64);
            setActiveTab('sketch');
        }
        if (route.params?.sketchPrompt !== undefined) {
            setPrompt(route.params.sketchPrompt);
        }
    }, [route.params?.sketchB64, route.params?.sketchPrompt]);

    useEffect(() => {
        const maxPriceValue = parsePositiveInt(maxPrice);
        const deadlineValue = parsePositiveInt(deadlineDays);
        const isFilled =
            title.trim() !== '' &&
            content.trim() !== '' &&
            category.trim() !== '' &&
            maxPriceValue !== null &&
            deadlineValue !== null;
        setFulfilled(isFilled);
    }, [title, content, category, maxPrice, deadlineDays]);

    const openSketchScreen = () => {
        navigation.navigate('ProposalSketchScreen', { initialPrompt: prompt });
    };

    const handleSubmit = async () => {
        try {
            const parsedMaxPrice = parsePositiveInt(maxPrice);
            const parsedDeadlineDays = parsePositiveInt(deadlineDays);

            if (parsedMaxPrice === null || parsedDeadlineDays === null) {
                Alert.alert('입력 오류', '가격과 마감 기한은 숫자만 입력해 주세요.');
                return;
            }
            let finalImageMetas = imageMetas;

            if (activeTab === 'sketch') {
                if (!sketchB64) {
                    Alert.alert('스케치 필요', '스케치 그리기 화면에서 스케치를 저장해 주세요.');
                    return;
                }
                finalImageMetas = [{
                    uri:      `data:image/png;base64,${sketchB64}`,
                    name:     'sketch.png',
                    type:     'image/png',
                    isSketch: true,
                    prompt,
                }];
            }

            const body = {
                title,
                content,
                category,
                maxPrice:     parsedMaxPrice,
                deadlineDays: parsedDeadlineDays,
                imageMetas:   finalImageMetas,
            };

            const result = await postProposal(body);

            if (result.success) {
                Alert.alert('✅ 등록 완료', '구매 요청이 성공적으로 등록되었습니다.');
                navigation.goBack();
            } else {
                Alert.alert('에러 발생', result.message ?? '등록에 실패했어요.');
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                Alert.alert('에러 발생', '오류가 발생했습니다.');
            } else {
                Alert.alert('에러 발생', '알 수 없는 오류');
            }
        }
    };

    const handlePickImage = async () => {
        const assets = await pickImagesFromLibrary(5);
        if (assets.length === 0) {
            return;
        }

        const newImages = assets.map((asset) => ({
            uri:  asset.uri,
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

                <View style={styles.header}>
                    <View style={styles.btnView}>
                        <TouchableOpacity
                            onPress={() => {navigation.goBack()}}
                            style={styles.backBtn}
                        >
                            <Text style={styles.backIcon}>←</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerView}>
                        <Text style={styles.headerTitle}>제작 제안 글 작성</Text>
                        <Text style={styles.headerSub}>필요한 상품의 정보를 입력해 주세요</Text>
                    </View>
                </View>

                <View style={tabStyles.tabRow}>
                    <TouchableOpacity
                        style={[tabStyles.tab, activeTab === 'image' && tabStyles.tabActive]}
                        onPress={() => setActiveTab('image')}
                    >
                        <Text style={[tabStyles.tabText, activeTab === 'image' && tabStyles.tabTextActive]}>
                            📷 이미지 업로드
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[tabStyles.tab, activeTab === 'sketch' && tabStyles.tabActive]}
                        onPress={() => setActiveTab('sketch')}
                    >
                        <Text style={[tabStyles.tabText, activeTab === 'sketch' && tabStyles.tabTextActive]}>
                            ✏️ 직접 스케치
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📦 상품 정보</Text>

                    <InputField label="제목"      placeholder="제목 입력"      value={title}        onChangeText={setTitle} />
                    <InputField label="상품 설명" placeholder="상품 설명 입력" value={content}      onChangeText={setContent} multiline />
                    <InputField label="가격"      placeholder="최대 가격 입력" value={maxPrice}     onChangeText={(text: string) => setMaxPrice(filterDigitsOnly(text))} numeric />
                    <InputField label="마감 기한" placeholder="일 단위 입력"   value={deadlineDays} onChangeText={(text: string) => setDeadlineDays(filterDigitsOnly(text))} numeric />

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

                    {activeTab === 'image' && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>상품 이미지</Text>
                            <TouchableOpacity style={styles.imageUploadBox} onPress={handlePickImage}>
                                <Text style={styles.imageUploadIcon}>📷</Text>
                                <Text style={styles.imageUploadText}>이미지 업로드</Text>
                                <Text style={styles.imageUploadSub}>최대 5장까지 업로드 가능</Text>
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
                    )}

                    {activeTab === 'sketch' && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>스케치</Text>
                            <Text style={tabStyles.sketchHint}>
                                별도 화면에서 스케치를 그려 주세요.
                            </Text>

                            {sketchB64 ? (
                                <View style={tabStyles.sketchPreviewWrap}>
                                    <Image
                                        source={{ uri: `data:image/png;base64,${sketchB64}` }}
                                        style={tabStyles.sketchPreview}
                                    />
                                    <Text style={tabStyles.sketchSavedText}>✅ 스케치 저장됨</Text>
                                </View>
                            ) : (
                                <View style={tabStyles.sketchEmptyBox}>
                                    <Text style={tabStyles.sketchEmptyText}>아직 스케치가 없어요</Text>
                                </View>
                            )}

                            <TouchableOpacity style={tabStyles.sketchBtn} onPress={openSketchScreen}>
                                <Text style={tabStyles.sketchBtnText}>
                                    {sketchB64 ? '✏️ 스케치 다시 그리기' : '✏️ 스케치 그리기'}
                                </Text>
                            </TouchableOpacity>

                            <View style={tabStyles.promptGroup}>
                                <Text style={styles.inputLabel}>AI 프롬프트</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="예: 흰색 무선 이어폰, 스튜디오 조명"
                                    placeholderTextColor="#aaa"
                                    value={prompt}
                                    onChangeText={setPrompt}
                                    multiline
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>
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

function InputField({ label, placeholder, value, onChangeText, multiline, numeric }: any) {
    return (
        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                style={[styles.input, multiline && { height: 100, textAlignVertical: 'top' }]}
                placeholder={placeholder}
                placeholderTextColor="#aaa"
                value={value}
                onChangeText={onChangeText}
                keyboardType={numeric ? 'number-pad' : 'default'}
                inputMode={numeric ? 'numeric' : undefined}
                multiline={multiline}
            />
        </View>
    );
}

const tabStyles = StyleSheet.create({
    tabRow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
        gap: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    tabActive:     { backgroundColor: '#0076F0' },
    tabText:       { fontSize: 14, color: '#888', fontWeight: '500' },
    tabTextActive: { color: '#fff', fontWeight: '700' },
    sketchHint: {
        fontSize: 13,
        color: '#666',
        marginBottom: 12,
        lineHeight: 18,
    },
    sketchEmptyBox: {
        height: 160,
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        marginBottom: 12,
    },
    sketchEmptyText: { fontSize: 14, color: '#888' },
    sketchPreviewWrap: { marginBottom: 12, alignItems: 'center' },
    sketchPreview: {
        width: '100%',
        height: 160,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: '#fff',
    },
    sketchSavedText: {
        marginTop: 8,
        fontSize: 13,
        fontWeight: '600',
        color: '#0076F0',
    },
    sketchBtn: {
        backgroundColor: '#eef2ff',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 4,
    },
    sketchBtnText: { color: '#0076F0', fontSize: 15, fontWeight: '700' },
    promptGroup:  { marginTop: 14 },
});
