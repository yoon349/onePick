// MyProposalList.tsx
// (개인) 내가 요청한 주문 제작 목록
// 카드 클릭 시 MyProposalFunding 이동

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

import ListHeader from '../../../public/screen/ListHeader';
import BidCard from '../../../public/screen/BidCard';

import { getMyProposals } from '../../../api/Proposal/getMyProposals';
import { deleteProposal } from '../../../api/Proposal/deleteProposal';

type HomeScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type Props = {
  navigation: HomeScreenNavigationProp;
};


// ── 타입 정의 ──────────────────────────────────────────────
type BidStatus = 'PENDING' | 'FINISHED' | 'CANCELED';

interface Bid {
  proposalId: number;
  title: string;
  content: string;
  proposalCategory: string;
  maxPrice: number;
  proposalStatus: BidStatus;
  writerNickname: string;
  createdAt: any;
  deadlineDays: number,
  fundingCount: number;
  thumbnail: any;
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
  proposalId: number;
};

function Buttons({ proposalId, }: ButtonsProps) {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const deleteMyProposal = async (proposalId: number) => {

    Alert.alert(
      '구매 요청 삭제',
      '정말 요청을 삭제하시겠습니까?',
      [
        {
          text: '아니오',
          style: 'cancel',
        },
        {
          text: '삭제하기',
          style: 'destructive',

          onPress: async () => {
            try {
                
              const result = await deleteProposal(proposalId);
              console.log(result);

              Alert.alert(
                '❎ 삭제 완료',
                '구매 요청이 삭제되었습니다.',
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
          onPress={() => deleteMyProposal(proposalId)}
        >
          <Text style={styles.btnText}>
            요청 삭제
          </Text>
        </TouchableOpacity>
      </View>
    );
}

// ── 메인 화면 ──────────────────────────────────────────────
export default function MyProposalList({ navigation }: Props) {

    const [myProposals, setMyProposals] = useState<any[]>([]);
    
    useEffect(() => {
        fetchMyProposalList();
    }, []);
    
    const fetchMyProposalList = async () => {
        try {
            const data = await getMyProposals();
            console.log(JSON.stringify(data, null, 2));
            
            if (Array.isArray(data)) {
                setMyProposals(data);
            } else if (Array.isArray(data.data)) {
                setMyProposals(data.data);
            } else {
                setMyProposals([]);
            }

        } catch (error) {
            console.log(error);
        }
    };



  
  const [activeTab, setActiveTab]   = useState<BidStatus>('PENDING');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = myProposals.filter( (myProposal) => myProposal.proposalStatus === activeTab,);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const counts = {
    PENDING: myProposals.filter( (mp) => mp.proposalStatus === 'PENDING' ).length,
    FINISHED: myProposals.filter( (mp) => mp.proposalStatus === 'FINISHED' ).length,
    CANCELED: myProposals.filter( (mp) => mp.proposalStatus === 'CANCELED' ).length,
  };


  return (
    <View style={styles.container}>

      {/* 헤더 */}
      <ListHeader
        title='내가 요청한 주문 제작 목록'
        count={myProposals.length - myProposals.filter((mp) => mp.proposalStatus === 'WRITING').length}
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
              {activeTab === 'PENDING' ? '🔍' : activeTab === 'FINISHED' ? '✅' : '❌'}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === 'PENDING'    ? '진행 중인 참여한 입찰이 없어요'  :
               activeTab === 'FINISHED' ? '종료된 참여한 입찰이 없어요'     :
                                          '취소된 참여한 입찰이 없어요'}
            </Text>
          </View>
        ) : (
          filtered.map(myProposal =>
            <BidCard
              key={myProposal.proposalId}
              id={myProposal.proposalId}
              title={myProposal.title}
              category={myProposal.proposalCategory}
              valueString={`${myProposal.maxPrice.toLocaleString()}원`}
              thumbnail={myProposal.thumbnail !== null ? myProposal.thumbnail.imageUrl : null}
              remainingDeadlineDays={myProposal.remainingDeadlineDays}
              buttonView={
                myProposal.proposalStatus === 'PENDING'
                ? <Buttons proposalId={myProposal.proposalId} />
                : null
              }
              onPressNav={() => {
                navigation.navigate('ProposalDetail', {
                  isMine: true,
                  proposalId: Number(myProposal.proposalId),
                })
              }}
            />
          )
        )}
      </ScrollView>

    </View>
  );
}

// ── 스타일 ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },

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
