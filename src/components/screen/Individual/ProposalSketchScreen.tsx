// ProposalSketchScreen.tsx
// 제작 요청용 스케치 전용 화면 (스크롤 없이 그리기)

import React, { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/StackNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProposalSketchScreen'>;
  route: RouteProp<RootStackParamList, 'ProposalSketchScreen'>;
};

const canvasStyle = `
  .m-signature-pad { border: none; box-shadow: none; margin: 0; }
  .m-signature-pad--body { border: none; }
  .m-signature-pad--footer { display: none; margin: 0; }
  body, html { margin: 0; padding: 0; background: #ffffff; }
`;

export default function ProposalSketchScreen({ navigation, route }: Props) {
  const signatureRef = useRef<any>(null);
  const [prompt, setPrompt] = useState(route.params?.initialPrompt ?? '');
  const [hasDrawn, setHasDrawn] = useState(false);

  const handleSignature = (sig: string) => {
    const sketchB64 = sig.replace('data:image/png;base64,', '');
    navigation.navigate({
      name: 'NewProposal',
      params: { sketchB64, sketchPrompt: prompt },
      merge: true,
    });
  };

  const handleDone = () => {
    if (!hasDrawn) {
      Alert.alert('스케치 필요', '먼저 스케치를 그려 주세요.');
      return;
    }
    signatureRef.current?.readSignature();
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setHasDrawn(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>스케치 그리기</Text>
            <Text style={styles.headerSub}>화면을 드래그해 그려 주세요</Text>
          </View>
        </View>

        <View style={styles.canvasWrapper}>
          <SignatureCanvas
            ref={signatureRef}
            onOK={handleSignature}
            onBegin={() => setHasDrawn(true)}
            onEmpty={() => Alert.alert('스케치 필요', '먼저 스케치를 그려 주세요.')}
            webStyle={canvasStyle}
            backgroundColor="white"
            penColor="black"
            dotSize={3}
            minWidth={2}
            maxWidth={4}
            style={styles.canvas}
            autoClear={false}
            imageType="image/png"
            descriptionText=""
            clearText=""
            confirmText=""
          />
        </View>

        <View style={styles.bottomPanel}>
          <View style={styles.promptHeader}>
            <Text style={styles.promptLabel}>AI 프롬프트</Text>
            <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
              <Text style={styles.clearBtnText}>지우기</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.promptInput}
            placeholder="예: 흰색 무선 이어폰, 스튜디오 조명"
            placeholderTextColor="#aaa"
            value={prompt}
            onChangeText={setPrompt}
            multiline
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
            <Text style={styles.doneBtnText}>스케치 저장하고 돌아가기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 28, color: '#1a1a2e' },
  headerTextWrap: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e' },
  headerSub: { fontSize: 13, color: '#666', marginTop: 2 },
  canvasWrapper: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  canvas: { flex: 1, width: '100%', height: '100%' },
  bottomPanel: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promptLabel: { fontSize: 14, fontWeight: '600', color: '#444' },
  clearBtn: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  clearBtnText: { color: '#ef4444', fontSize: 13, fontWeight: '600' },
  promptInput: {
    minHeight: 72,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#222',
    backgroundColor: '#fff',
  },
  doneBtn: {
    backgroundColor: '#0076F0',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  doneBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
