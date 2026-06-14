// MyFundingList.tsx
// (개인) 회원이 참여한 펀딩 모집 글 목록 화면
// ~~~ 카드 클릭 시 ProductFundingDetail로 이동 ???(개발필요)

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/StackNavigator';

import ListHeader from '../../../public/screen/ListHeader';
import BidCard from '../../../public/screen/BidCard';

import { getMyFundings } from '../../../api/Product/getMyFundings';
import { deleteApplyFunding } from '../../../api/Product/deleteApplyFunding';
import { requireSessionReady } from '../../../api/axios';

type HomeScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type Props = {
  navigation: HomeScreenNavigationProp;
};


// ── 타입 정의 ──────────────────────────────────────────────
type BidStatus = 'PENDING' | 'FINISHED' | 'CANCELED';

interface Bid {
  fundingId: number;
  productId: number;
  productTitle: string;
  quantity: number;
  productStatus: BidStatus;
  //category: string;
}

// ── 탭 설정 ────────────────────────────────────────────────
const TABS: { key: BidStatus; label: string; color: string }[] = [
  { key: 'PENDING',    label: '진행중', color: '#0076F0' },
  { key: 'FINISHED', label: '종료',   color: '#10b981' },
  { key: 'CANCELED', label: '취소',   color: '#ef4444' },
];


// ── 상태 뱃지 ──────────────────────────────────────────────
function StatusBadge({ status }: { status: BidStatus }) {
  const config = {
    PENDING:    { label: '진행중', bg: '#eef2ff', color: '#0076F0' },
    FINISHED: { label: '종료',   bg: '#d1fae5', color: '#065f46' },
    CANCELED: { label: '취소',   bg: '#fee2e2', color: '#991b1b' },
  }[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

// ── 버튼 뷰 ──────────────────────────────────────────────
type ButtonsProps = {
  productId: number;
};

function Buttons({ productId, }: ButtonsProps) {
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const cancelMyFunding = async (productId: number) => {

    Alert.alert(
      '입찰 취소',
      '정말 입찰을 취소하시겠습니까?',
      [
        {
          text: '아니오',
          style: 'cancel',
        },
        {
          text: '취소하기',
          style: 'destructive',

          onPress: async () => {
            try {
                
              const result = await deleteApplyFunding(productId);
              console.log(result);

              Alert.alert(
                '❎ 취소 완료',
                '입찰이 취소되었습니다.',
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
          },
        },
      ],
    );
  };


  return (
      <View style={styles.btnView}>
          <TouchableOpacity
            style={[styles.btn, styles.cancelBtn]}
            onPress={() => cancelMyFunding(productId)}
          >
            <Text style={styles.btnText}>
              참여 취소
            </Text>
          </TouchableOpacity>
          </View>
    );
}

// ── 메인 화면 ──────────────────────────────────────────────
export default function MyFundingList({ navigation }: Props) {

    const [myFundings, setMyFundings] = useState<any[]>([]);
    
    useEffect(() => {
        const load = async () => {
            try {
                await requireSessionReady();
            } catch {
                navigation.replace('Login');
                return;
            }
            await fetchMyFundingList();
        };
        load();
    }, [navigation]);
    
    const fetchMyFundingList = async () => {
        try {
            const data = await getMyFundings();
            console.log(JSON.stringify(data, null, 2));
            
            if (Array.isArray(data)) {
                setMyFundings(data);
            } else if (Array.isArray(data.data)) {
                setMyFundings(data.data);
            } else {
                setMyFundings([]);
            }

        } catch (error) {
            console.log(error);
        }
    };



  
  const [activeTab, setActiveTab]   = useState<BidStatus>('PENDING');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = myFundings.filter( (myFunding) => myFunding.productStatus === activeTab,);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const counts = {
    PENDING: myFundings.filter( (mf) => mf.productStatus === 'PENDING' ).length,
    FINISHED: myFundings.filter( (mf) => mf.productStatus === 'FINISHED' ).length,
    CANCELED: myFundings.filter( (mf) => mf.productStatus === 'CANCELED' ).length,
  };


  return (
    <View style={styles.container}>

      <ListHeader
        title='내가 참여한 펀딩 목록'
        count={myFundings.length - myFundings.filter((mf) => mf.productStatus === 'WRITING').length}
        onPressBack={() => navigation.goBack()}
      />
      {/* 헤더 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>입찰 내역</Text>
        <Text style={styles.headerSub}>총 {myFundings.length}건의 입찰</Text>
      </View>
      */}
      {/* 탭 */}
      <View style={styles.tabRow}>
        {TABS.map(tab => {
          const isSelected = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isSelected && { borderBottomColor: tab.color, borderBottomWidth: 2.5 }]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, isSelected && { color: tab.color, fontWeight: '700' }]}>
                {tab.label}
              </Text>
              <View style={[styles.tabCount, isSelected && { backgroundColor: tab.color }]}>
                <Text style={[styles.tabCountText, isSelected && { color: '#fff' }]}>
                  {counts[tab.key]}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 리스트 */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>
              {activeTab === 'PENDING' ? '🔍' : activeTab === 'FINISHED' ? '✅' : '❌'}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === 'PENDING'    ? '진행 중인 참여한 입찰이 없어요'  :
               activeTab === 'FINISHED' ? '종료된 참여한 입찰이 없어요'     :
                                          '취소된 참여한 입찰이 없어요'}
            </Text>
          </View>
        ) : (
          filtered.map(myFunding =>
            <BidCard
              key={myFunding.fundingId}
              id={myFunding.fundingId}
              title={myFunding.productTitle}
              category={myFunding.category}
              valueString={`${myFunding.quantity}개`}
              thumbnail={myFunding.thumbnail !== null ? myFunding.thumbnail.imageUrl : null}
              remainingDeadlineDays={myFunding.remainingDeadlineDays}
              buttonView={
                myFunding.productStatus === 'PENDING'
                ? <Buttons productId={myFunding.productId} />
                : null
              }
              onPressNav={() => {
                navigation.navigate('ProductFundingDetail', {
                  isMine: true,
                  productId: Number(myFunding.productId),
                })
              }}
            />)
        )}
      </ScrollView>

    </View>
  );
}

// ── 스타일 ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  header: {
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
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
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 2 },
  headerSub:   { fontSize: 13, color: '#888' },
  tabRow: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 14, gap: 6,
    borderBottomWidth: 2.5, borderBottomColor: 'transparent',
  },
  tabText:      { fontSize: 14, color: '#aaa', fontWeight: '500' },
  tabCount:     { backgroundColor: '#f0f0f0', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  tabCountText: { fontSize: 11, color: '#888', fontWeight: '700' },
  list:         { flex: 1 },
  listContent:  { padding: 16, gap: 12, paddingBottom: 40 },
  card: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
    elevation: 2, gap: 14,
  },
  cardEmoji: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: '#f5f6fa', alignItems: 'center', justifyContent: 'center',
  },
  emojiText:    { fontSize: 26 },
  cardContent:  { flex: 1, gap: 4 },
  cardTopRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productName:  { fontSize: 14, fontWeight: '700', color: '#1a1a2e', flex: 1, marginRight: 8 },
  bidAmount:    { fontSize: 18, fontWeight: 'bold', color: '#0076F0' },
  cardBottomRow:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  dateText:     { fontSize: 12, color: '#aaa' },
  remainText:   { fontSize: 12, color: '#0076F0', fontWeight: '600' },
  remainUrgent: { color: '#ef4444' },
  endDateText:  { fontSize: 12, color: '#aaa' },
  badge:        { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText:    { fontSize: 11, fontWeight: '700' },
  emptyBox:     { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyEmoji:   { fontSize: 40 },
  emptyText:    { fontSize: 15, color: '#aaa' },

  btnView: {
    flexDirection: 'row',
    width: '70%',
    justifyContent: 'flex-end',
  },

  btn: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },

  finishBtn: {
    //borderColor: '#10b981',
    //backgroundColor: '#A7F09F',
    backgroundColor: '#10b981',
  },

  cancelBtn: {
    //borderColor: '#ef4444',
    //backgroundColor: '#FFCFCF',
    backgroundColor: '#ef4444',
  },

  btnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

});
