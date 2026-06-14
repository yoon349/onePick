// MyProposalDetail.tsx
// (개인) 구매 요청 글 상세 화면 — 이미지, 제목, 설명 + 입찰 요청 목록

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  Alert, View, Text, Image, TouchableOpacity,
  StyleSheet, ActivityIndicator, Dimensions,
} from 'react-native';
import FormScrollView from '../../common/FormScrollView';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/StackNavigator';
import { RouteProp } from '@react-navigation/native';
import { getFundings } from '../../../api/ProposalFunding/getFundings';
import { patchAcceptFunding } from '../../../api/ProposalFunding/patchAcceptFunding';
import { patchRejectFunding } from '../../../api/ProposalFunding/patchRejectFunding';
import { api } from '../../../api/axios';
import StatusBadge from './StatusBadge';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route:      RouteProp<RootStackParamList, 'MyProposalDetail'>;
};

const CATEGORY_LABELS: Record<string, string> = {
  FOOD: '식품', FURNITURE: '가구', DIGITAL: '디지털',
  FASHION: '패션', BEAUTY: '뷰티', ETC: '기타',
};

const IMAGE_BOX_HEIGHT = Math.round(Dimensions.get('window').height * 0.45);

export default function MyProposalDetail({ navigation, route }: Props) {
  const { proposalId } = route.params;

  const [proposal, setProposal]               = useState<any>(null);
  const [proposalFundings, setProposalFundings] = useState<any[]>([]);
  const [loading, setLoading]                 = useState(true);

  useEffect(() => {
    fetchAll();
  }, [proposalId]);

  const fetchAll = async () => {
    try {
      // 제품 상세 + 입찰 목록 동시 호출
      const [proposalRes, fundingsRes] = await Promise.all([
        api.get(`/api/v1/proposals/${proposalId}`),
        getFundings(proposalId),
      ]);
      setProposal(proposalRes.data.data);
      setProposalFundings(fundingsRes.data ?? []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (proposalFundingId: number) => {
    try {
      const result = await patchAcceptFunding(proposalFundingId);
      Alert.alert('✅ 수락 완료', '입찰을 성공적으로 수락했어요!');
      navigation.goBack();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert('에러 발생', JSON.stringify(error.response?.data) || error.message);
      } else {
        Alert.alert('에러 발생', '알 수 없는 오류');
      }
    }
  };

  const handleReject = async (proposalFundingId: number) => {
    try {
      const result = await patchRejectFunding(proposalFundingId);
      Alert.alert('❎ 거절 완료', '입찰을 성공적으로 거절했어요!');
      navigation.goBack();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert('에러 발생', JSON.stringify(error.response?.data) || error.message);
      } else {
        Alert.alert('에러 발생', '알 수 없는 오류');
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#0076F0" />
      </View>
    );
  }

  // AI 이미지 상태 확인
  const mainImage = proposal?.images?.find((img: any) => img.aiStatus === 'SUCCESS' && img.imageUrl)
    ?? proposal?.images?.find((img: any) => img.imageUrl)
    ?? proposal?.thumbnail;

  const aiRunning = proposal?.images?.some(
    (img: any) => img.aiStatus === 'QUEUED' || img.aiStatus === 'RUNNING'
  );

  const isBidClosed = proposal?.proposalStatus !== 'PENDING';

  return (
    <View style={styles.container}>
      <FormScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>구매 요청 상세</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* 이미지 영역 */}
        <View style={styles.imageBox}>
          {mainImage?.imageUrl ? (
            <Image
              source={{ uri: mainImage.imageUrl }}
              style={styles.productImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              {aiRunning ? (
                <>
                  <ActivityIndicator color="#0076F0" />
                  <Text style={styles.imagePlaceholderText}>AI 이미지 생성 중...</Text>
                </>
              ) : (
                <Text style={styles.imagePlaceholderEmoji}>📦</Text>
              )}
            </View>
          )}
          {mainImage?.sourceType === 'AI' && mainImage?.aiStatus === 'SUCCESS' && (
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>🤖 AI 생성</Text>
            </View>
          )}
          <View style={styles.badgeWrapper}>
            <StatusBadge status={proposal?.proposalStatus} />
          </View>
        </View>

        {/* 기본 정보 */}
        <View style={styles.section}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {CATEGORY_LABELS[proposal?.proposalCategory] ?? proposal?.proposalCategory}
            </Text>
          </View>
          <Text style={styles.productName}>{proposal?.title}</Text>
          <Text style={styles.price}>
            {proposal?.maxPrice != null ? `${proposal.maxPrice.toLocaleString()}원` : '-'}
          </Text>
          <Text style={styles.seller}>by {proposal?.writerNickname}</Text>
        </View>

        {/* 제품 설명 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 제품 설명</Text>
          <Text style={styles.description}>{proposal?.content}</Text>
        </View>

        {/* 펀딩 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 요청 정보</Text>
          <View style={styles.infoGrid}>
            <InfoItem label="마감 기간" value={`${proposal?.deadlineDays}일`} />
            <InfoItem label="입찰 수"   value={`${proposal?.fundingCount}건`} />
            <InfoItem label="상태"      value={proposal?.proposalStatus === 'PENDING' ? '진행중' : '완료'} />
            <InfoItem label="등록일"    value={proposal?.createdAt?.slice(0, 10) ?? '-'} />
          </View>
        </View>

        {/* 입찰 요청 목록 */}
        <View style={styles.section}>
          {isBidClosed && (
            <View style={styles.closedBanner}>
              <Text style={styles.closedBannerText}>입찰이 종료되었어요.</Text>
            </View>
          )}
          <Text style={styles.sectionTitle}>📩 입찰 요청 목록</Text>
          {proposalFundings.length === 0 ? (
            <Text style={styles.emptyText}>아직 입찰 요청이 없어요</Text>
          ) : (
            proposalFundings.map((funding: any) => (
              <View key={funding.proposalFundingId} style={styles.fundingCard}>
                <View style={styles.fundingInfo}>
                  <Text style={styles.fundingNickname}>{funding.sellerNickname ?? '판매자'}</Text>
                  <Text style={styles.fundingPrice}>{funding.price?.toLocaleString()}원</Text>
                </View>
                <View style={styles.fundingBtns}>
                  <TouchableOpacity
                    style={[styles.rejectBtn, isBidClosed && styles.actionBtnDisabled]}
                    disabled={isBidClosed}
                    onPress={() => handleReject(funding.proposalFundingId)}
                  >
                    <Text style={[styles.rejectBtnText, isBidClosed && styles.actionBtnTextDisabled]}>거절</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.acceptBtn, isBidClosed && styles.actionBtnDisabled]}
                    disabled={isBidClosed}
                    onPress={() => handleAccept(funding.proposalFundingId)}
                  >
                    <Text style={[styles.acceptBtnText, isBidClosed && styles.actionBtnTextDisabled]}>수락</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </FormScrollView>
    </View>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#f5f6fa' },
  loadingBox:   { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll:       { paddingBottom: 40 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff',
  },
  backBtn:     { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon:    { fontSize: 22, color: '#1a1a2e' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a2e' },

  imageBox: {
    height: IMAGE_BOX_HEIGHT,
    backgroundColor: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },
  productImage:         { width: '100%', height: '100%' },
  imagePlaceholder:     { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  imagePlaceholderEmoji:{ fontSize: 60 },
  imagePlaceholderText: { fontSize: 14, color: '#888' },
  aiBadge:     { position: 'absolute', top: 12, right: 12, backgroundColor: '#0076F0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  aiBadgeText: { fontSize: 12, color: '#fff', fontWeight: '700' },
  badgeWrapper: {
    position: 'absolute',
    bottom: 16,
    right: 24,
    zIndex: 20,
  },

  section:      { backgroundColor: '#fff', padding: 20, marginTop: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginBottom: 12 },

  categoryBadge:     { backgroundColor: '#eef2ff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 8 },
  categoryBadgeText: { fontSize: 12, color: '#0076F0', fontWeight: '600' },
  productName: { fontSize: 22, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 8 },
  price:       { fontSize: 20, fontWeight: 'bold', color: '#0076F0', marginBottom: 4 },
  seller:      { fontSize: 13, color: '#888' },
  description: { fontSize: 14, color: '#555', lineHeight: 22 },
  emptyText:   { fontSize: 14, color: '#aaa', textAlign: 'center', paddingVertical: 20 },

  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  infoItem: { width: '47%', backgroundColor: '#f8f8ff', borderRadius: 12, padding: 14 },
  infoLabel:{ fontSize: 12, color: '#888', marginBottom: 4 },
  infoValue:{ fontSize: 16, fontWeight: '700', color: '#1a1a2e' },

  fundingCard: {
    backgroundColor: '#f8f8ff', borderRadius: 12, padding: 14,
    marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  fundingInfo:     { flex: 1 },
  fundingNickname: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', marginBottom: 4 },
  fundingPrice:    { fontSize: 16, fontWeight: 'bold', color: '#0076F0' },
  fundingBtns:     { flexDirection: 'row', gap: 8 },
  rejectBtn:       { borderWidth: 1, borderColor: '#ef4444', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  rejectBtnText:   { color: '#ef4444', fontSize: 13, fontWeight: '600' },
  acceptBtn:       { backgroundColor: '#0076F0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  acceptBtnText:   { color: '#fff', fontSize: 13, fontWeight: '600' },
  actionBtnDisabled: { opacity: 0.45 },
  actionBtnTextDisabled: { color: '#94a3b8' },
  closedBanner: {
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  closedBannerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0076F0',
    textAlign: 'center',
  },
});
