// NewProposal.tsx
// (개인) 구매 요청 글 작성
// 탭 1: 이미지 업로드 / 탭 2: 스케치

import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
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

import FormScrollView from '../../common/FormScrollView';
import { Dropdown } from 'react-native-element-dropdown';
import SignatureCanvas from 'react-native-signature-canvas';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/StackNavigator';
import { styles } from './NewProposalStyle';
import { postProposal } from '../../../api/Proposal/postProposal';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Props = { navigation: HomeScreenNavigationProp; };
type TabType = 'image' | 'sketch';

const categories = [
    { label: '음식',      value: 'FOOD' },
    { label: '가구',      value: 'FURNITURE' },
    { label: '전자기기',  value: 'DIGITAL' },
    { label: '의류/패션', value: 'FASHION' },
    { label: '미용',      value: 'BEAUTY' },
    { label: '기타',      value: 'ETC' },
];

export default function NewProposal({ navigation }: Props) {

    const signatureRef                    = useRef<any>(null);
    const [activeTab, setActiveTab]       = useState<TabType>('image');
    const [fulfilled, setFulfilled]       = useState(false);
    const [title, setTitle]               = useState('');
    const [content, setContent]           = useState('');
    const [category, setCategory]         = useState('');
    const [maxPrice, setMaxPrice]         = useState('');
    const [deadlineDays, setDeadlineDays] = useState('');
    const [imageMetas, setImageMetas]     = useState<any[]>([]);
    const [sketchB64, setSketchB64]       = useState<string | null>(null);
    const [hasDrawn, setHasDrawn]         = useState(false);
    const [prompt, setPrompt]             = useState('');

    useEffect(() => {
        const isFilled =
            title.trim() !== '' &&
            content.trim() !== '' &&
            category.trim() !== '' &&
            maxPrice.trim() !== '' &&
            deadlineDays.trim() !== '';
        setFulfilled(isFilled);
    }, [title, content, category, maxPrice, deadlineDays]);

    const handleSubmit = async () => {
        try {
            // ✅ 탭에 따라 다른 imageMetas 구성
            let finalImageMetas = imageMetas;

            if (activeTab === 'sketch') {
                if (!sketchB64) {
                    Alert.alert('스케치를 저장해 주세요.');
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
                maxPrice:     Number(maxPrice),
                deadlineDays: Number(deadlineDays),
                imageMetas:   finalImageMetas,
            };

            console.log(body);
            const result = await postProposal(body);
            console.log(result);

            if (result.success) {
                Alert.alert('등록 완료', '구매 요청이 성공적으로 등록되었습니다.');
                navigation.goBack();
            } else {
                Alert.alert('에러 발생', result.message ?? '등록에 실패했어요.');
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error);
                Alert.alert('에러 발생', JSON.stringify(error.response?.data) || error.message);
            } else {
                Alert.alert('에러 발생', '알 수 없는 오류');
            }
        }
    };

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibrary({
            mediaType: 'photo',
            selectionLimit: 5,
        });
        if (result.didCancel) return;
        if (result.assets) {
            const newImages = result.assets.map((asset) => ({
                uri:  asset.uri,
                name: asset.fileName,
                type: asset.type,
            }));
            setImageMetas((prev) => [...prev, ...newImages]);
        }
    };

    const handleSignature = (sig: string) => {
        setSketchB64(sig.replace('data:image/png;base64,', ''));
        setHasDrawn(true);
    };

    const handleClearSketch = () => {
        signatureRef.current?.clearSignature();
        setSketchB64(null);
        setHasDrawn(false);
    };

    const canvasStyle = `
        .m-signature-pad { border: none; box-shadow: none; }
        .m-signature-pad--body { border: none; }
        body { background: #ffffff; }
    `;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <FormScrollView contentContainerStyle={styles.scroll}>

                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>🛒 구매 요청 글 작성</Text>
                    <Text style={styles.headerSub}>상품 정보를 입력해 주세요</Text>
                </View>

                {/* 탭 */}
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

                {/* CARD */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📦 상품 정보</Text>

                    <InputField label="제목"      placeholder="제목 입력"      value={title}        onChangeText={setTitle} />
                    <InputField label="상품 설명" placeholder="상품 설명 입력" value={content}      onChangeText={setContent} multiline />
                    <InputField label="가격"      placeholder="최대 가격 입력" value={maxPrice}     onChangeText={setMaxPrice} keyboardType="numeric" />
                    <InputField label="마감 기한" placeholder="일 단위 입력"   value={deadlineDays} onChangeText={setDeadlineDays} keyboardType="numeric" />

                    {/* 카테고리 */}
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

                    {/* ── 탭 1: 이미지 업로드 ── */}
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

                    {/* ── 탭 2: 스케치 ── */}
                    {activeTab === 'sketch' && (
                        <View style={styles.inputGroup}>
                            <View style={tabStyles.sketchHeader}>
                                <Text style={styles.inputLabel}>스케치</Text>
                                <TouchableOpacity style={tabStyles.clearBtn} onPress={handleClearSketch}>
                                    <Text style={tabStyles.clearBtnText}>지우기</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={tabStyles.canvasWrapper}>
                                <SignatureCanvas
                                    ref={signatureRef}
                                    onOK={handleSignature}
                                    onBegin={() => setHasDrawn(true)}
                                    webStyle={canvasStyle}
                                    backgroundColor="white"
                                    penColor="black"
                                    dotSize={3}
                                    minWidth={2}
                                    maxWidth={4}
                                    style={{ flex: 1 }}
                                    autoClear={false}
                                    imageType="image/png"
                                    descriptionText=""
                                    clearText="지우기"
                                    confirmText="저장"
                                />
                            </View>

                            {hasDrawn && (
                                <TouchableOpacity
                                    style={tabStyles.saveBtn}
                                    onPress={() => signatureRef.current?.readSignature()}
                                >
                                    <Text style={tabStyles.saveBtnText}>
                                        {sketchB64 ? '✅ 스케치 저장됨' : '스케치 저장'}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            <View style={tabStyles.promptGroup}>
                                <Text style={styles.inputLabel}>AI 프롬프트 (영문 권장)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="예: wireless earphone, white, studio lighting"
                                    placeholderTextColor="#aaa"
                                    value={prompt}
                                    onChangeText={setPrompt}
                                />
                            </View>
                        </View>
                    )}
                </View>

                {/* BUTTON */}
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
    sketchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    canvasWrapper: {
        height: 260,
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    clearBtn:     { backgroundColor: '#fee2e2', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
    clearBtnText: { color: '#ef4444', fontSize: 13, fontWeight: '600' },
    saveBtn:      { marginTop: 10, backgroundColor: '#eef2ff', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
    saveBtnText:  { color: '#0076F0', fontSize: 14, fontWeight: '600' },
    promptGroup:  { marginTop: 14 },
});
