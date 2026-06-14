// AiProductPriceScreen.tsx
// AI 적정가격 분석 — 입력 화면

import axios from 'axios';
import React, { useState } from 'react';
import {
    Alert, Text, TouchableOpacity, View,
    TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet,
} from 'react-native';
import FormScrollView from '../../common/FormScrollView';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/StackNavigator';
import { postProductPriceJob } from '../../../api/ProductPrice/productPriceApi';

import { SCREEN_HEADER_TOP_COMPACT } from '../../../utils/screenLayout';


type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function AiProductPriceScreen({ navigation }: Props) {

    const [name, setName]           = useState('');
    const [cost, setCost]           = useState('');
    const [design, setDesign]       = useState('');
    const [materials, setMaterials] = useState('');
    const [usage, setUsage]         = useState('');
    const [loading, setLoading]     = useState(false);

    const handleStart = async () => {
        if (!name || !cost) {
            Alert.alert('입력 오류', '제품명과 원가는 필수 입력이에요.');
            return;
        }
        if (isNaN(Number(cost))) {
            Alert.alert('입력 오류', '원가는 숫자로 입력해 주세요.');
            return;
        }

        setLoading(true);
        try {
            const job = await postProductPriceJob({
                name,
                cost:      Number(cost),
                design:    design || '기본 디자인',
                materials: materials || '일반 소재',
                usage:     usage || '일반 사용',
            });

            // 로딩 화면으로 이동
            navigation.navigate('AiLoadingScreen', {
                jobId:     job.jobId,
                productId: job.productId,
                name,
            });

        } catch (error: any) {
            Alert.alert('에러 상세', error?.message ?? JSON.stringify(error));
        } finally {
            setLoading(false);
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
                    <View style={styles.btnView}>
                        <TouchableOpacity
                            onPress={() => {navigation.goBack()}}
                            style={styles.backBtn}
                        >
                            <Text style={styles.backIcon}>←</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerView}>
                        <Text style={styles.headerTitle}>AI 적정가격 분석</Text>
                    </View>
                </View>


                {/* 설명 */}
                <View style={styles.descBox}>
                    <Text style={styles.descIcon}>🤖</Text>
                    <Text style={styles.descTitle}>AI가 적정 판매가를 분석해 드려요</Text>
                    <Text style={styles.descSub}>상품 정보를 입력하면 AI가 시장 데이터를 분석해 최적의 판매가와 상세 설명을 생성해 드려요</Text>
                </View>

                {/* 입력 카드 */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📦 상품 정보 입력</Text>

                    <InputField label="제품명 *"    placeholder="예: 스테인리스 진공 텀블러 500ml" value={name}      onChangeText={setName} />
                    <InputField label="원가 (원) *" placeholder="예: 7800"                        value={cost}      onChangeText={setCost} keyboardType="numeric" />
                    <InputField label="디자인"      placeholder="예: 무광 블랙, 원터치 뚜껑"       value={design}    onChangeText={setDesign} />
                    <InputField label="원재료"      placeholder="예: 304 스테인리스, 실리콘 패킹"   value={materials} onChangeText={setMaterials} />
                    <InputField label="사용처"      placeholder="예: 사무실, 캠핑, 등산"           value={usage}     onChangeText={setUsage} />
                </View>

                {/* 시작 버튼 */}
                <TouchableOpacity
                    style={[styles.button, (!name || !cost || loading) && styles.buttonDisabled]}
                    onPress={handleStart}
                    disabled={!name || !cost || loading}
                >
                    {loading
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={styles.buttonText}>✨ AI 분석 시작</Text>
                    }
                </TouchableOpacity>

            </FormScrollView>
        </KeyboardAvoidingView>
    );
}

function InputField({ label, placeholder, value, onChangeText, keyboardType }: any) {
    return (
        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#aaa"
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType ?? 'default'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fa' },
    scroll:    { padding: 20, paddingBottom: 40 },



    header: {
        marginTop: SCREEN_HEADER_TOP_COMPACT,
        flexDirection: 'row',
    },


    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a2e',
        marginBottom: 6,
    },
    
    headerView: {
        left: 10,
        marginBottom: 20,
        paddingTop: Platform.OS === 'ios' ? 10 : 0,
    },
    
    btnView: {
        alignItems: 'flex-start',
        marginTop: 10,
    },
    
    backBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    backIcon: {
        fontSize: 32,
        color: '#1a1a2e',
    },

    descBox: {
        backgroundColor: '#0076F0', borderRadius: 16,
        padding: 20, alignItems: 'center', marginBottom: 20, gap: 8,
    },
    descIcon:  { fontSize: 36 },
    descTitle: { fontSize: 16, fontWeight: '700', color: '#fff', textAlign: 'center' },
    descSub:   { fontSize: 13, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 20 },

    card: {
        backgroundColor: '#fff', borderRadius: 16, padding: 20,
        marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    },
    sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginBottom: 16 },

    inputGroup: { marginBottom: 16 },
    inputLabel: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 8 },
    input: {
        backgroundColor: '#fafafa', borderRadius: 12, borderWidth: 1,
        borderColor: '#e0e0e0', paddingHorizontal: 14, paddingVertical: 12,
        fontSize: 14, color: '#222',
    },

    button:         { backgroundColor: '#0076F0', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
    buttonDisabled: { backgroundColor: '#B6CAF3' },
    buttonText:     { color: '#fff', fontSize: 16, fontWeight: '700' },
});
