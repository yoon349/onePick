// ProductFundingDetail.tsx
// 제품 상세 페이지 — ProductFundingList에서 눌렀을 때 이동

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import FormScrollView from '../../common/FormScrollView';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/StackNavigator';
import { RouteProp } from '@react-navigation/native';

import { getProduct } from '../../../api/Product/getProduct';

import StatusBadge from '../../../public/screen/StatusBadge';

type HomeScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type ProductFundingDetailRouteProp =
    RouteProp<
        RootStackParamList,
        'ProductFundingDetail'
    >;

type Props = {
  navigation: HomeScreenNavigationProp;
    route: ProductFundingDetailRouteProp;
};


const CATEGORY_LABELS: Record<string, string> = {
  FOOD: '식품', FURNITURE: '가구', DIGITAL: '디지털',
  FASHION: '패션', BEAUTY: '뷰티', ETC: '기타',
};




function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}


export default function ProductFundingDetail({ navigation, route }: Props) {
  
  const request = route.params;

  const [product, setProduct] = useState<any>(null);

  const [fulfilled, setFulfilled] = useState(false);
  const [bidAmount, setBidAmount] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  
  useEffect(() => {

    const fetchProduct = async () => {
        try {
            const data = await getProduct(request.productId);
            console.log(JSON.stringify(data, null, 2));

            setProduct(data.data);

        } catch (error) {
            console.log(error);
        }
    };
      
    fetchProduct();

    const isFilled = bidAmount.trim() !== '';
    setFulfilled(isFilled);

    }, [request.productId, bidAmount]);

  

  const handleBid = () => {
    if (!bidAmount || isNaN(Number(bidAmount))) {
      Alert.alert('참여 오류', '개수를 올바르게 입력해 주세요.');
      return;
    }
    if (Number(bidAmount) < product.minQuantity) {
      Alert.alert('참여 오류', `최소 참여 가능 개수는 ${product.minQuantity}개입니다.`);
      return;
    }

    Alert.alert(
      '펀딩 참여 확인',
      `${Number(bidAmount)}개로 펀딩 참여하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '참여하기',
          onPress: () => {
            setModalVisible(false);
            setBidAmount('');
            
            navigation.navigate('Payment', {
              isPayment: true,
              productId: Number(request.productId),
              quantity: Number(bidAmount),
            })
          }
        }
      ]
    );
  };


if (!product) {
    return (
        <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
        >
            <Text>불러오는 중...</Text>
        </View>
    );
 }

  const fundingRate = product.fundedQuantity === 0 ? 0 : product.fundedQuantity / product.minQuantity * 100;

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
          <Text style={styles.headerTitle}>제품 상세</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* 이미지 영역 */}
        <View style={styles.imageBox}>
          <Text style={styles.imageEmoji}>{/*product.emoji ?? */'📦'}</Text>

          <View style={styles.badgeWrapper}>
            <StatusBadge status={product?.status} />
          </View>
        </View>
        
        {/* 기본 정보 */}
        <View style={styles.section}>
          <View style={styles.sectionTop}>
            <Text style={styles.productName}>{product?.title}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {CATEGORY_LABELS[product?.category] ?? product?.category}
              </Text>
            </View>
          </View>
          <Text style={styles.price}>{product?.price?.toLocaleString()}원</Text>
        </View>

        {/* 펀딩 달성률 */}
        <View style={styles.section}>
          <View style={styles.fundingHeader}>
            <Text style={styles.sectionTitle}>🔥 펀딩 현황</Text>
            <Text style={styles.fundingRate}>{Math.round(fundingRate)}% 달성</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${fundingRate}%` }]} />
          </View>
          <View style={styles.fundingInfo}>
            <Text style={styles.fundingInfoText}>목표 달성률</Text>
            <Text style={[styles.fundingInfoText, fundingRate >= 100 && styles.fundingSuccess]}>
              {fundingRate >= 100 ? '🎉 목표 달성!' : `${Math.round(fundingRate)}%`}
            </Text>
          </View>
        </View>
        

        {/* 제품 설명 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 제품 설명</Text>
          <Text style={styles.description}>
            {product.content}
          </Text>
        </View>

        {/* 펀딩 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 요청 정보</Text>
          <View style={styles.infoGrid}>
            <InfoItem
              label="마감 기한"
              value={
                product?.remainingDeadlineDays > 0
                ? `${product?.remainingDeadlineDays}일 남음`
                : product?.remainingDeadlineDays === 0
                ? '오늘 마감'
                : `${Math.abs(product?.remainingDeadlineDays)}일 경과`
              }
            />
            <InfoItem label="최소 참여 수량"   value={`${product?.minQuantity}개`} />
            <InfoItem
              label="펀딩 모집 상태"
              value={
                fundingRate < 100
                ? '미달'
                : '펀딩 달성'
              }
            />
            <InfoItem label="등록일"    value={product?.createdAt?.slice(0, 10) ?? '-'} />
          </View>
        </View>


        <View style={{ height: 100 }} />



      {/* 하단 입찰 버튼 */}
      { product.status === 'PENDING' && !request.isMine ?
      (
        <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
        >
            <Text style={styles.buttonText}>
                참여하기
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
            <Text style={styles.modalTitle}>📋 주문량 입력</Text>
            <Text style={styles.modalSub}>
              최소 개수: {product.minQuantity}개
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="주문량 입력"
              placeholderTextColor="#aaa"
              value={bidAmount}
              onChangeText={setBidAmount}
              keyboardType="numeric"
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => {
                  setModalVisible(false);
                  setBidAmount('');
                }}
              >
                <Text style={styles.modalCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!fulfilled}
                style={styles.modalBidBtn}
                onPress={handleBid}
              >
              <Text style={styles.modalBidText}>참여하기</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </Modal>
    
      </FormScrollView>
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

  // 이미지

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
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    //padding: 16,
    paddingBottom: 30,
    paddingHorizontal: 30,
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