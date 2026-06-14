// ProposalDetail.tsx
// (개인) 구매 요청 글 상세 화면 — 이미지, 제목, 설명 + 입찰 요청 목록

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  Alert, View, Text, Image, TouchableOpacity, Modal,
  TextInput, StyleSheet, ActivityIndicator,
} from 'react-native';
import FormScrollView from '../../common/FormScrollView';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/StackNavigator';
import { RouteProp } from '@react-navigation/native';

import { getFundings } from '../../../api/ProposalFunding/getFundings';
import { patchAcceptFunding } from '../../../api/ProposalFunding/patchAcceptFunding';
import { patchRejectFunding } from '../../../api/ProposalFunding/patchRejectFunding';
import { postProposalFunding } from '../../../api/ProposalFunding/postProposalFunding';

import ProposalStatusBadge from '../../../public/screen/ProposalStatusBadge';

import { api } from '../../../api/axios';



type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route:      RouteProp<RootStackParamList, 'ProposalDetail'>;
};


const CATEGORY_LABELS: Record<string, string> = {
  FOOD: '식품', FURNITURE: '가구', DIGITAL: '디지털',
  FASHION: '패션', BEAUTY: '뷰티', ETC: '기타',
};

export default function ProposalDetail({ navigation, route }: Props) {

  const request = route.params;

  const [proposal, setProposal] = useState<any>(null);
  const [proposalFundings, setProposalFundings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [fulfilled, setFulfilled] = useState(false);
  const [bidPrice, setBidPrice] = useState('');
  const [bidContent, setBidContent] = useState('');
  
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {

    const isFilled =
      bidPrice.trim() !== '' &&
      bidContent.trim() !== '';
      
    setFulfilled(isFilled);

  }, [bidPrice, bidContent]);


  useEffect(() => {

  const fetchAll = async () => {
    try {
      // 제품 상세 + 입찰 목록 동시 호출
      const [proposalRes, fundingsRes] = await Promise.all([
        api.get(`/api/v1/proposals/${request.proposalId}`),
        getFundings(request.proposalId),
      ]);

      console.log('제안제품 상세');
      console.log(proposalRes.data.data);
      setProposal(proposalRes.data.data);

      console.log('받은 제안 목록');
      console.log(fundingsRes.data ?? []);
      setProposalFundings(fundingsRes.data ?? []);


    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

   fetchAll();
    
  }, [request.proposalId]);
  

    const handlePropose = async (proposalId: number) => {

      try {
        const body = {
          price: Number(bidPrice),
          content: bidContent,
        }

        const result = await postProposalFunding(proposalId, body);
        console.log(result);
        
        setModalVisible(false);
        Alert.alert(
              '✅ 제안 성공',
              '제작 제안이 완료되었습니다.'
        );


        navigation.goBack();

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error);
                
            Alert.alert(
                '에러 발생',
                '오류가 발생했습니다.'
            );

        } else {
            Alert.alert(
                '에러 발생',
                '알 수 없는 오류',
            );
        }
    }
}

  const handleAccept = async (proposalFundingId: number) => {

    try {

      const result = await patchAcceptFunding(proposalFundingId);
      console.log(result);

      navigation.navigate('ProposalPayment', {
        proposalFundingId: proposalFundingId,
      });

    } catch (error) {

      if (axios.isAxiosError(error)) {
        Alert.alert('에러 발생', '오류가 발생했습니다.');
      } else {
        Alert.alert('에러 발생', '알 수 없는 오류');
      }
    }
  };

  const handleReject = async (proposalFundingId: number) => {
    try {
      const result = await patchRejectFunding(proposalFundingId);

      Alert.alert('❎ 거절 완료', '제안을 성공적으로 거절했습니다.');
      navigation.goBack();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert('에러 발생', '오류가 발생했습니다.');
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
          <Text style={styles.headerTitle}>제작 요청 상세</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* 이미지 영역 */}
        <View style={styles.imageBox}>
          { mainImage ? (
            <Image
              source={{ uri: encodeURI(mainImage.imageUrl) }}
              style={styles.productImage}
              resizeMode="cover"
              onError={(e) => {
                console.log('이미지 로드 실패');
                console.log(proposal.thumbnail.imageUrl);
                console.log(e.nativeEvent);
              }}
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
          {proposal?.images?.some(
            (img: any) =>
              img.sourceType === 'AI' &&
              img.aiStatus === 'SUCCESS'
          ) && (
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>🤖 AI 생성</Text>
            </View>
          )}
          <View style={styles.badgeWrapper}>
            <ProposalStatusBadge status={proposal?.status} />
          </View>
        </View>

        {/* 기본 정보 */}
        <View style={styles.section}>
          <View style={styles.sectionTop}>
            <Text style={styles.productName}>{proposal?.title}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {CATEGORY_LABELS[proposal?.proposalCategory] ?? proposal?.proposalCategory}
              </Text>
            </View>
          </View>
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
          <View style={styles.infoGrid}>
            <InfoItem
              label="마감 기한"
              value={
                proposal?.remainingDeadlineDays > 0
                ? `${proposal?.remainingDeadlineDays}일 남음`
                : proposal?.remainingDeadlineDays === 0
                ? '오늘 마감'
                : `${Math.abs(proposal?.remainingDeadlineDays)}일 경과`
              }
            />
            <InfoItem label="최대 가격"   value={`${proposal?.maxPrice.toLocaleString()}원`} />
            <InfoItem
              label="받은 제안 수"
              value={`${proposal?.fundingCount}개`}
            />
            <InfoItem label="등록일"    value={proposal?.createdAt?.slice(0, 10) ?? '-'} />
          </View>
          </View>
        </View>

        {/* 입찰 요청 목록 */}
        { request.isMine ?
        (<View style={styles.section}>
          {isBidClosed && (
            <View style={styles.closedBanner}>
              <Text style={styles.closedBannerText}>입찰이 종료되었어요.</Text>
            </View>
          )}
          <Text style={styles.sectionTitle}>📩 제작 제안 목록</Text>
          {proposalFundings.length === 0 ? (
            <Text style={styles.emptyText}>아직 받은 제안이 없어요</Text>
          ) : (
            proposalFundings.map((funding: any, index) => (
              <View key={funding.proposalFundingId} style={styles.fundingCard}>
                <View style={styles.fundingRank}>
                  <Text style={styles.fundingRankText}>{index + 1}</Text>
                </View>
                <View style={styles.fundingInfo}>
                  <Text style={styles.fundingNickname}>{funding.sellerNickname ?? '판매자'}</Text>
                  <Text style={styles.fundingContent}>
                    {funding.content}
                  </Text>
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
        ) : ( <></> )
        }

        <View style={{ height: 100, }}/>

      {/* 하단 입찰 버튼 */}
      { proposal.proposalStatus === 'PENDING' && !request.isMine ?
      (
        <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
        >
            <Text style={styles.buttonText}>
                제작 제안하기
            </Text>
        </TouchableOpacity>

      ) : ( <></> )
      }

      {/* 입찰 모달 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>📋 제안서 입력</Text>
            <Text style={styles.modalSub}>
              {`최대 금액: ${proposal.maxPrice.toLocaleString()}원`}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="금액 입력"
              placeholderTextColor="#aaa"
              value={bidPrice}
              onChangeText={setBidPrice}
              keyboardType="numeric"
              autoFocus
            />

            <TextInput
              style={styles.modalInput}
              placeholder="내용 입력"
              placeholderTextColor="#aaa"
              value={bidContent}
              onChangeText={setBidContent}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => {
                  setModalVisible(false);
                  setBidPrice('');
                  setBidContent('');
                }}
              >
                <Text style={styles.modalCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!fulfilled}
                style={styles.modalBidBtn}
                onPress={() => handlePropose(proposal.proposalId)}
              >
              <Text style={styles.modalBidText}>참여하기</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </Modal>



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
    height: 160,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
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

  headerTitle: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a2e',
  },

  imageBox: {
    position: 'relative',
    height: 240,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  imageEmoji: {
    fontSize: 100,
  },
  
  badgeWrapper: {
    position: 'absolute',
    top: 186,
    right: 24,
    zIndex: 20,
},




  productImage:         { width: '100%', height: '100%' },
  imagePlaceholder:     { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  imagePlaceholderEmoji:{ fontSize: 60 },
  imagePlaceholderText: { fontSize: 14, color: '#888' },
  aiBadge:     { position: 'absolute', top: 12, right: 12, backgroundColor: '#0076F0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  aiBadgeText: { fontSize: 12, color: '#fff', fontWeight: '700' },

  section:      { backgroundColor: '#fff', padding: 20, marginTop: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginBottom: 12 },

  categoryBadge: {
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 2,
    marginLeft: 15,
  },
  categoryBadgeText: { fontSize: 12, color: 'gray', fontWeight: '600' },

  sectionTop: {
    flexDirection: 'row',
  },

  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  infoItem: { width: '47%', backgroundColor: '#f8f8ff', borderRadius: 12, padding: 14 },
  infoLabel:{ fontSize: 12, color: '#888', marginBottom: 4 },
  infoValue:{ fontSize: 16, fontWeight: '700', color: '#1a1a2e' },

  productName: { fontSize: 22, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 8 },
  price:       { fontSize: 26, fontWeight: 'bold', color: '#0076F0', marginBottom: 4 },
  seller:      { marginTop: 3, fontSize: 13, color: '#888' },
  description: { fontSize: 14, color: '#555', lineHeight: 22 },
  emptyText:   { fontSize: 14, color: '#aaa', textAlign: 'center', paddingVertical: 20 },

  fundingCard: {
    backgroundColor: '#f8f8ff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,

    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  fundingRank: {
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },

  fundingRankText: {
    fontSize: 15,
    fontWeight: '700',
  },
  
  fundingInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },

  fundingNickname: { fontSize: 16, fontWeight: '600', color: '#1a1a2e', marginBottom: 4 },
  fundingContent: {
    marginVertical: 2,
    fontSize: 12,
    color: '#888',
    lineHeight: 14,
  },
  fundingPrice:    { fontSize: 16, fontWeight: 'bold', color: '#0076F0' },
  fundingBtns:     { flexDirection: 'row', gap: 8 },
  rejectBtn:       { borderWidth: 1, borderColor: '#ef4444', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  rejectBtnText:   { color: '#ef4444', fontSize: 13, fontWeight: '600' },
  acceptBtn:       { borderWidth: 1, borderColor: '#065f46', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  acceptBtnText:   { color: '#065f46', fontSize: 13, fontWeight: '600' },
  actionBtnDisabled: { opacity: 0.45, borderColor: '#cbd5e1' },
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

  // 모달
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 6,
  },
  modalSub: {
    fontSize: 13,
    color: '#888',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#0076F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    color: '#1a1a2e',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    color: '#888',
    fontWeight: '600',
  },
  modalBidBtn: {
    flex: 2,
    backgroundColor: '#0076F0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalBidText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '700',
  },

  // 버튼
  button: {
    width: '92%',
    backgroundColor: '#0076F0',
    borderRadius: 16,
    paddingVertical: 18,
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

});
