// AiLoadingScreen.tsx
// AI 적정가격 분석 로딩 화면

import React, { useEffect, useRef, useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, Animated, Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/StackNavigator';
import { getProductPriceJob } from '../../../api/ProductPrice/productPriceApi';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
    route:      RouteProp<RootStackParamList, 'AiLoadingScreen'>;
};

const STEPS = [
    '상품 정보 분석 중',
    '시장 데이터 수집 중',
    '적정가격 계산 중',
    '상세 설명 작성 중',
];

export default function AiLoadingScreen({ navigation, route }: Props) {
    const { jobId, productId, name } = route.params;

    const [currentStep, setCurrentStep] = useState(0);
    const progressAnim                  = useRef(new Animated.Value(0)).current;
    const pollingRef                    = useRef<any>(null);
    const stepRef                       = useRef<any>(null);

    // 단계 자동 진행
    useEffect(() => {
        let step = 0;
        stepRef.current = setInterval(() => {
            if (step < STEPS.length - 1) {
                step++;
                setCurrentStep(step);
                Animated.timing(progressAnim, {
                    toValue: (step / (STEPS.length - 1)) * 80,
                    duration: 400,
                    useNativeDriver: false,
                }).start();
            }
        }, 1000);
        return () => clearInterval(stepRef.current);
    }, []);

    // Polling
    useEffect(() => {
        const poll = async () => {
            try {
                const result = await getProductPriceJob(jobId);

                if (result.status === 'SUCCESS') {
                    clearInterval(pollingRef.current);
                    clearInterval(stepRef.current);

                    Animated.timing(progressAnim, {
                        toValue: 100,
                        duration: 500,
                        useNativeDriver: false,
                    }).start();

                    const price = result.result?.price ?? null;
                    const description = result.result?.description
                        ? result.result.description
                            .replace(/\uFFFD/g, '')
                            .replace(/\(상품 정보\)/g, '')
                            .replace(/\(원문 설명\)/g, '')
                            .trim()
                        : null;

                    setTimeout(() => {
                        navigation.replace('NewProduct', {
                            aiPrice:       price,
                            aiDescription: description,
                            aiProductId:   productId,
                            productName:   name,
                        });
                    }, 500);

                } else if (result.status === 'FAILED') {
                    clearInterval(pollingRef.current);
                    Alert.alert('분석 실패', 'AI 분석에 실패했어요. 다시 시도해 주세요.', [
                        { text: '확인', onPress: () => navigation.goBack() },
                    ]);
                }
            } catch (e) {
                console.log('polling 오류:', e);
            }
        };

        pollingRef.current = setInterval(poll, 3000);
        poll();

        return () => clearInterval(pollingRef.current);
    }, [jobId]);

    const progressWidth = progressAnim.interpolate({
        inputRange:  [0, 100],
        outputRange: ['0%', '100%'],
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>

                <View style={styles.iconBox}>
                    <Text style={styles.icon}>🤖</Text>
                </View>

                <Text style={styles.title}>AI가 적정가격을 분석하고 있어요</Text>
                <Text style={styles.sub}>{name}</Text>

                {/* 진행바 */}
                <View style={styles.progressBg}>
                    <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
                </View>

                {/* 단계 목록 */}
                <View style={styles.stepList}>
                    {STEPS.map((step, idx) => {
                        const isDone    = idx < currentStep;
                        const isCurrent = idx === currentStep;
                        return (
                            <View key={idx} style={styles.stepRow}>
                                <Text style={styles.stepIcon}>
                                    {isDone ? '✓' : isCurrent ? '⏳' : '○'}
                                </Text>
                                <Text style={[
                                    styles.stepLabel,
                                    isDone    && styles.stepDone,
                                    isCurrent && styles.stepCurrent,
                                ]}>
                                    {step}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                <Text style={styles.hint}>AI 분석은 1~2분 소요될 수 있어요</Text>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a2e' },
    content:   { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },

    iconBox: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: 'rgba(79,70,229,0.3)',
        alignItems: 'center', justifyContent: 'center', marginBottom: 24,
    },
    icon:  { fontSize: 36 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 },
    sub:   { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 32 },

    progressBg:   { width: '100%', height: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 5, overflow: 'hidden', marginBottom: 32 },
    progressFill: { height: '100%', backgroundColor: '#0076F0', borderRadius: 5 },

    stepList: { width: '100%', gap: 14, marginBottom: 32 },
    stepRow:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
    stepIcon:    { fontSize: 16, width: 24, textAlign: 'center', color: '#a5b4fc' },
    stepLabel:   { fontSize: 14, color: 'rgba(255,255,255,0.4)' },
    stepDone:    { color: '#34d399' },
    stepCurrent: { color: '#fff', fontWeight: '600' },

    elapsed: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 },
    hint:    { fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'center' },
});
