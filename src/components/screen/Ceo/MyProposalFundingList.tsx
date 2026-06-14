// MyProposalFundingList.tsx
// (기업) 회원이 요청한 입찰 목록 화면
// ~

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/StackNavigator';

import ListHeader from '../../../public/screen/ListHeader'
import BidCard from '../../../public/screen/BidCard';

import { getProduct } from '../../../api/Product/getProduct';
import { getMyFundings } from '../../../api/ProposalFunding/getMyFundings';
import { deleteProposalFunding } from '../../../api/ProposalFunding/deleteProposalFunding';

type HomeScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type Props = {
  navigation: HomeScreenNavigationProp;
};


// ── 타입 정의 ──────────────────────────────────────────────
type BidStatus = 'PENDING' | 'CHOSEN' | 'REJECTED';

interface Bid {
  proposalFundingId: number;
  price: number;
  content: string;
  status: BidStatus;
  proposalId: number,
  ceoId: number;
  ceoNickname: string;
}

// ── 탭 설정 ────────────────────────────────────────────────
const TABS: { key: BidStatus; label: string; color: string }[] = [
  { key: 'PENDING',    label: '대기중', color: '#0076F0' },
  { key: 'CHOSEN', label: '낙찰',   color: '#10b981' },
  { key: 'REJECTED', label: '거절',   color: '#ef4444' },
];


// ── 입찰 카드 ──────────────────────────────────────────────
type ButtonsProps = {
  proposalFundingId: number;
};

function Buttons({ proposalFundingId, }: ButtonsProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  /*const remaining  = getRemainingTime(bid.endDate);*/
  //const isPending   = bid.status === 'PENDING';
  /*const isUrgent   = isActive && remaining.includes('시간') && !remaining.includes('일');*/

  const cancelMyProposalFunding = async (proposalFundingId: number) => {

    Alert.alert(
      '제작 제안 취소',
      '정말 제작 제안을 취소하시겠습니까?',
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
                
              const result = await deleteProposalFunding(proposalFundingId);
              console.log(result);

              Alert.alert(
                '취소 완료',
                '입찰 요청이 취소되었습니다.',
              );

              navigation.goBack();

            } catch (error) {
                
              if (axios.isAxiosError(error)) {
                console.log(error);

                Alert.alert(
                  '에러 발생',
                  JSON.stringify(error.response?.data,) || error.message,);

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
          onPress={() => cancelMyProposalFunding(proposalFundingId)}
        >
          <Text style={styles.btnText}>
            제안 취소
          </Text>
        </TouchableOpacity>
        </View>
  );
}

// ── 메인 화면 ──────────────────────────────────────────────
export default function MyProposalFundingList({ navigation }: Props) {

    const [myProposalFundings, setMyProposalFundings] = useState<any[]>([]);
    
    useEffect(() => {
        fetchMyProposalFundingList();
    }, []);
    
    const fetchMyProposalFundingList = async () => {
        try {
            const data = await getMyFundings();
            console.log(JSON.stringify(data, null, 2));
            
            if (Array.isArray(data)) {
                setMyProposalFundings(data);
            } else if (Array.isArray(data.data)) {
                setMyProposalFundings(data.data);
            } else {
                setMyProposalFundings([]);
            }

        } catch (error) {

          if (axios.isAxiosError(error)) {

            console.log('status:',
            error.response?.status);

            console.log('data:',
            error.response?.data);

            console.log('message:',
            error.message);
          }
        }
    };



  
  const [activeTab, setActiveTab]   = useState<BidStatus>('PENDING');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = myProposalFundings.filter( (myProposalFunding) => myProposalFunding.proposalFundingStatus === activeTab,);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const counts = {
    PENDING: myProposalFundings.filter( (mpf) => mpf.proposalFundingStatus === 'PENDING' ).length,
    CHOSEN: myProposalFundings.filter( (mpf) => mpf.proposalFundingStatus === 'CHOSEN' ).length,
    REJECTED: myProposalFundings.filter( (mpf) => mpf.proposalFundingStatus === 'REJECTED' ).length,
  };


  return (
    <View style={styles.container}>

      {/* 헤더 */}
      <ListHeader
        title='내가 제안한 주문 제작 목록'
        count={myProposalFundings.length - myProposalFundings.filter( (mpf) => mpf.proposalFundingStatus === 'WRITING' ).length}
        onPressBack={() => navigation.goBack()}
      />
      

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
              {activeTab === 'PENDING' ? '🔍' : activeTab === 'CHOSEN' ? '✅' : '❌'}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === 'PENDING'    ? '대기 중인 제작 제안이 없어요'  :
               activeTab === 'CHOSEN' ? '낙찰된 제작 제안이 없어요'     :
                                          '거절된 제작 제안이 없어요'}
            </Text>
          </View>
        ) : (
          filtered.map(myProposalFunding =>
            <BidCard
              key={myProposalFunding.proposalId}
              id={myProposalFunding.proposalId}
              title={myProposalFunding.proposalTitle}
              category={myProposalFunding.proposalCategory}
              valueString={`제안 ${myProposalFunding.proposalFundingPrice.toLocaleString()}원`}
              thumbnail={null}
              remainingDeadlineDays={0}
              buttonView={
                myProposalFunding.productStatus === 'PENDING'
                ? <Buttons proposalFundingId={myProposalFunding.proposalId} />
                : null
              }
              onPressNav={() => {
                navigation.navigate('ProposalDetail', {
                  isMine: false,
                  proposalId: Number(myProposalFunding.proposalId),
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
  cardImage: {
    width: 52, height: 52, borderRadius: 14,
  },
  emojiText:    { fontSize: 18 },
  cardContent:  { flex: 1, gap: 4 },
  cardTopRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productName:  { fontSize: 14, fontWeight: '700', color: '#1a1a2e', flex: 1, marginRight: 8 },
  bidAmount:    { fontSize: 18, fontWeight: 'bold', color: '#0076F0' },
  cardBottomRow:{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 2, },
  dateText:     { marginRight: 10, fontSize: 12, color: '#737684' },
  categoryText: { fontWeight: '600', fontSize: 13, },
  remainText:   { fontSize: 12, color: 'gray', fontWeight: '600' },
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
