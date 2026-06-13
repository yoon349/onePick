// screens/ProductDetail/ProductDetail.tsx
// 제품 상세 페이지 — ProductList에서 눌렀을 때 이동

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/StackNavigator';

type ProductDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetail'>;
type ProductDetailRouteProp      = RouteProp<RootStackParamList, 'ProductDetail'>;

type Props = {
  navigation: ProductDetailNavigationProp;
  route:      ProductDetailRouteProp;
};

// ── 남은 시간 계산 ─────────────────────────────────────────
function getRemainingTime(endDate: string): string {
  const now  = new Date();
  const end  = new Date(endDate);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return '마감';

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0)  return `${days}일 ${hours}시간 남음`;
  if (hours > 0) return `${hours}시간 ${minutes}분 남음`;
  return `${minutes}분 남음`;
}

export default function ProductDetail({ navigation, route }: Props) {
  const { product } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [bidAmount, setBidAmount]        = useState('');

  const remaining   = getRemainingTime(product.endDate ?? '2026-12-31T18:00:00');
  const fundingRate = product.fundingRate ?? 0;
  const isUrgent    = remaining.includes('시간') && !remaining.includes('일');

  const handleBid = () => {
    if (!bidAmount || isNaN(Number(bidAmount))) {
      Alert.alert('입력 오류', '올바른 입찰 금액을 입력해 주세요.');
      return;
    }
    if (Number(bidAmount) < product.price) {
      Alert.alert('입찰 오류', `최소 입찰 금액은 ${product.price.toLocaleString()}원입니다.`);
      return;
    }

    Alert.alert(
      '입찰 확인',
      `${Number(bidAmount).toLocaleString()}원으로 입찰하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '입찰하기',
          onPress: () => {
            setModalVisible(false);
            setBidAmount('');
            Alert.alert('✅ 입찰 완료', '입찰이 성공적으로 완료됐어요!');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
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
          <Text style={styles.headerTitle}>제품 상세</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* 이미지 영역 */}
        <View style={styles.imageBox}>
          <Text style={styles.imageEmoji}>{product.emoji ?? '📦'}</Text>
        </View>

        {/* 남은 시간 배너 */}
        <View style={[styles.timeBanner, isUrgent && styles.timeBannerUrgent]}>
          <Text style={styles.timeBannerText}>
            ⏱ {remaining}
          </Text>
        </View>

        {/* 기본 정보 */}
        <View style={styles.section}>
          <Text style={styles.productName}>{product.title ?? product.name}</Text>
          <Text style={styles.seller}>by {product.seller ?? '판매자'}</Text>
          <Text style={styles.price}>{product.price?.toLocaleString()}원</Text>
        </View>

        {/* 펀딩 달성률 */}
        <View style={styles.section}>
          <View style={styles.fundingHeader}>
            <Text style={styles.sectionTitle}>🔥 펀딩 현황</Text>
            <Text style={styles.fundingRate}>{fundingRate}% 달성</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(fundingRate, 100)}%` }]} />
          </View>
          <View style={styles.fundingInfo}>
            <Text style={styles.fundingInfoText}>목표 달성률</Text>
            <Text style={[styles.fundingInfoText, fundingRate >= 100 && styles.fundingSuccess]}>
              {fundingRate >= 100 ? '🎉 목표 달성!' : `${fundingRate}%`}
            </Text>
          </View>
        </View>

        {/* 제품 설명 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 제품 설명</Text>
          <Text style={styles.description}>
            {product.description ?? '이 제품은 크라우드펀딩을 통해 제작되는 제품입니다. 많은 관심과 참여 부탁드립니다.'}
          </Text>
        </View>

        {/* 판매자 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 판매자 정보</Text>
          <View style={styles.sellerBox}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerAvatarText}>
                {(product.seller ?? '판').charAt(0)}
              </Text>
            </View>
            <View>
              <Text style={styles.sellerName}>{product.seller ?? '판매자'}</Text>
              <Text style={styles.sellerSub}>크라우드펀딩 판매자</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />

      </ScrollView>

      {/* 하단 입찰 버튼 */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPrice}>
          <Text style={styles.bottomPriceLabel}>시작가</Text>
          <Text style={styles.bottomPriceValue}>{product.price?.toLocaleString()}원</Text>
        </View>
        <TouchableOpacity
          style={styles.bidButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.bidButtonText}>입찰하기</Text>
        </TouchableOpacity>
      </View>

      {/* 입찰 모달 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>💰 입찰 금액 입력</Text>
            <Text style={styles.modalSub}>
              최소 입찰가: {product.price?.toLocaleString()}원
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="입찰 금액 입력"
              placeholderTextColor="#aaa"
              value={bidAmount}
              onChangeText={setBidAmount}
              keyboardType="numeric"
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => { setModalVisible(false); setBidAmount(''); }}
              >
                <Text style={styles.modalCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBidBtn} onPress={handleBid}>
                <Text style={styles.modalBidText}>입찰하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scroll: {
    paddingBottom: 40,
  },

  // 헤더
  header: {
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
    fontSize: 22,
    color: '#1a1a2e',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a2e',
  },

  // 이미지
  imageBox: {
    height: 260,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageEmoji: {
    fontSize: 100,
  },

  // 남은 시간 배너
  timeBanner: {
    backgroundColor: '#eef2ff',
    paddingVertical: 10,
    alignItems: 'center',
  },
  timeBannerUrgent: {
    backgroundColor: '#fee2e2',
  },
  timeBannerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0076F0',
  },

  // 섹션
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 12,
  },

  // 기본 정보
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  seller: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
  },
  price: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0076F0',
  },

  // 펀딩
  fundingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fundingRate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0076F0',
    borderRadius: 5,
  },
  fundingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fundingInfoText: {
    fontSize: 12,
    color: '#888',
  },
  fundingSuccess: {
    color: '#10b981',
    fontWeight: '700',
  },

  // 설명
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },

  // 판매자
  sellerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sellerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0076F0',
  },
  sellerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  sellerSub: {
    fontSize: 12,
    color: '#888',
  },

  // 하단 바
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  bottomPrice: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 12,
    color: '#888',
  },
  bottomPriceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  bidButton: {
    backgroundColor: '#0076F0',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  bidButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
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
});
