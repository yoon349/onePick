// ListScreen.tsx
// 입찰 목록 화면 — 진행중 / 종료 / 취소 탭 구성
// 카드 클릭 시 ProductDetail로 이동

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';

type HomeScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type Props = {
  navigation: HomeScreenNavigationProp;
};


// ── 타입 정의 ──────────────────────────────────────────────
type BidStatus = 'active' | 'completed' | 'cancelled';

interface Bid {
  id:          number;
  productName: string;
  bidAmount:   number;
  status:      BidStatus;
  date:        string;
  endDate:     string;
  imageEmoji:  string;
  seller?:     string;
  description?: string;
  fundingRate?: number;
  category?:   string;
  minPeople?:  number;
}

// ── 더미 데이터 ────────────────────────────────────────────
const DUMMY_BIDS: Bid[] = [
  {
    id: 1,
    productName: '스마트 텀블러 블랙 500ml',
    bidAmount: 28000,
    status: 'active',
    date: '2026-05-28',
    endDate: '2026-06-10T18:00:00',
    imageEmoji: '🫖',
    seller: '판매자1',
    description: '친환경 소재로 만든 스마트 텀블러입니다.',
    fundingRate: 187,
    category: '라이프스타일',
    minPeople: 10,
  },
  {
    id: 2,
    productName: '캠핑 의자 카키 기본형',
    bidAmount: 48000,
    status: 'active',
    date: '2026-05-27',
    endDate: '2026-06-08T12:00:00',
    imageEmoji: '🪑',
    seller: '판매자2',
    description: '가볍고 튼튼한 캠핑 의자입니다.',
    fundingRate: 245,
    category: '캠핑',
    minPeople: 5,
  },
  {
    id: 3,
    productName: 'LED 무드등 화이트 소형',
    bidAmount: 20000,
    status: 'active',
    date: '2026-05-26',
    endDate: '2026-06-07T09:00:00',
    imageEmoji: '💡',
    seller: '판매자3',
    description: '감성적인 분위기를 연출하는 LED 무드등입니다.',
    fundingRate: 130,
    category: '라이프스타일',
    minPeople: 20,
  },
  {
    id: 4,
    productName: '친환경 노트북 파우치 15인치',
    bidAmount: 35000,
    status: 'completed',
    date: '2026-05-20',
    endDate: '2026-05-25T18:00:00',
    imageEmoji: '💼',
    seller: '판매자4',
    description: '친환경 소재로 제작된 노트북 파우치입니다.',
    fundingRate: 98,
    category: '패션',
    minPeople: 15,
  },
  {
    id: 5,
    productName: '핸드드립 커피 세트 2인용',
    bidAmount: 42000,
    status: 'completed',
    date: '2026-05-15',
    endDate: '2026-05-22T18:00:00',
    imageEmoji: '☕',
    seller: '판매자5',
    description: '집에서 카페 분위기를 즐길 수 있는 커피 세트입니다.',
    fundingRate: 312,
    category: '주방',
    minPeople: 8,
  },
  {
    id: 6,
    productName: '무선 충전 패드 2구',
    bidAmount: 30000,
    status: 'cancelled',
    date: '2026-05-10',
    endDate: '2026-05-18T18:00:00',
    imageEmoji: '🔋',
    seller: '판매자6',
    description: '2구 무선 충전 패드입니다.',
    fundingRate: 55,
    category: '테크',
    minPeople: 30,
  },
  {
    id: 7,
    productName: '휴대용 선풍기 목걸이형',
    bidAmount: 16000,
    status: 'cancelled',
    date: '2026-05-08',
    endDate: '2026-05-15T18:00:00',
    imageEmoji: '🌀',
    seller: '판매자7',
    description: '목걸이형 휴대용 선풍기입니다.',
    fundingRate: 72,
    category: '라이프스타일',
    minPeople: 50,
  },
];

// ── 탭 설정 ────────────────────────────────────────────────
const TABS: { key: BidStatus; label: string; color: string }[] = [
  { key: 'active',    label: '진행중', color: '#0076F0' },
  { key: 'completed', label: '종료',   color: '#10b981' },
  { key: 'cancelled', label: '취소',   color: '#ef4444' },
];

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

// ── 상태 뱃지 ──────────────────────────────────────────────
function StatusBadge({ status }: { status: BidStatus }) {
  const config = {
    active:    { label: '진행중', bg: '#eef2ff', color: '#0076F0' },
    completed: { label: '종료',   bg: '#d1fae5', color: '#065f46' },
    cancelled: { label: '취소',   bg: '#fee2e2', color: '#991b1b' },
  }[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

// ── 입찰 카드 ──────────────────────────────────────────────
function BidCard({ bid }: { bid: Bid }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const remaining  = getRemainingTime(bid.endDate);
  const isActive   = bid.status === 'active';
  const isUrgent   = isActive && remaining.includes('시간') && !remaining.includes('일');

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('ProductDetail', {
          product: {
            id:          bid.id,
            title:       bid.productName,
            seller:      bid.seller,
            price:       bid.bidAmount,
            status:      bid.status,
            category:    bid.category,
            minPeople:   bid.minPeople,
            description: bid.description,
            fundingRate: bid.fundingRate,
            endDate:     bid.endDate,
            emoji:       bid.imageEmoji,
          },
        })
      }
    >
      {/* 왼쪽 이모지 */}
      <View style={styles.cardEmoji}>
        <Text style={styles.emojiText}>{bid.imageEmoji}</Text>
      </View>

      {/* 중앙 정보 */}
      <View style={styles.cardContent}>
        <View style={styles.cardTopRow}>
          <Text style={styles.productName} numberOfLines={1}>{bid.productName}</Text>
          <StatusBadge status={bid.status} />
        </View>

        <Text style={styles.bidAmount}>{bid.bidAmount.toLocaleString()}원</Text>

        <View style={styles.cardBottomRow}>
          <Text style={styles.dateText}>📅 {bid.date}</Text>
          {isActive && (
            <Text style={[styles.remainText, isUrgent && styles.remainUrgent]}>
              ⏱ {remaining}
            </Text>
          )}
          {!isActive && (
            <Text style={styles.endDateText}>
              마감 {bid.endDate.slice(0, 10)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── 메인 화면 ──────────────────────────────────────────────
export default function BidListScreen({ navigation }: Props) {
  const [activeTab, setActiveTab]   = useState<BidStatus>('active');
  const [refreshing, setRefreshing] = useState(false);
  const [bids]                      = useState<Bid[]>(DUMMY_BIDS);

  const filtered = bids.filter(b => b.status === activeTab);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const counts = {
    active:    bids.filter(b => b.status === 'active').length,
    completed: bids.filter(b => b.status === 'completed').length,
    cancelled: bids.filter(b => b.status === 'cancelled').length,
  };

  return (
    <View style={styles.container}>

      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>입찰 내역</Text>
        <Text style={styles.headerSub}>총 {bids.length}건의 입찰</Text>
      </View>

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
              {activeTab === 'active' ? '🔍' : activeTab === 'completed' ? '✅' : '❌'}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === 'active'    ? '진행 중인 입찰이 없어요'  :
               activeTab === 'completed' ? '종료된 입찰이 없어요'     :
                                          '취소된 입찰이 없어요'}
            </Text>
          </View>
        ) : (
          filtered.map(bid => <BidCard key={bid.id} bid={bid} />)
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
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, gap: 14,
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
});
