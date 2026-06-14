// MyOrderList.tsx — GET /api/v1/order 내 주문 현황

import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { getMyOrders } from '../../../api/Order/getMyOrders';
import { ProposalOrder } from '../../../interface/order';
import { RootStackParamList } from '../../../navigation/StackNavigator';
import ListHeader from '../../../public/screen/ListHeader';
import {
  CATEGORY_LABELS,
  formatOrderAmount,
  getOrderStatusLabel,
  getOrderStatusStyle,
} from '../../../utils/orderStatus';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MyOrderList'>;
};

type MyOrderListRouteProp = RouteProp<RootStackParamList, 'MyOrderList'>;

type OrderCardProps = {
  order: ProposalOrder;
  onDetail: () => void;
};

function OrderCard({ order, onDetail }: OrderCardProps) {
  const statusStyle = getOrderStatusStyle(order.orderStatus);
  const thumbnailUrl = order.thumbnail?.imageUrl;

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        {thumbnailUrl ? (
          <Image source={{ uri: encodeURI(thumbnailUrl) }} style={styles.thumbnail} />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Text style={styles.thumbnailEmoji}>📦</Text>
          </View>
        )}

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {order.proposalTitle ?? '제목 없음'}
          </Text>
          <Text style={styles.cardMeta}>
            {CATEGORY_LABELS[order.proposalCategory] ?? order.proposalCategory ?? '기타'}
            {' · '}
            {formatOrderAmount(order.paymentAmount ?? order.proposalFundingPrice)}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusBadgeText, { color: statusStyle.color }]}>
              {getOrderStatusLabel(order.orderStatus)}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.detailBtn} activeOpacity={0.8} onPress={onDetail}>
        <Text style={styles.detailBtnText}>상세보기</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function MyOrderList({ navigation }: Props) {
  const route = useRoute<MyOrderListRouteProp>();

  const [orders, setOrders] = useState<ProposalOrder[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await getMyOrders();
      setOrders(data.filter(order => order?.orderId != null));
      console.log(orders);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <ListHeader
        title="내 주문 현황"
        count={orders.length}
        onPressBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {orders.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyText}>주문 내역이 없어요</Text>
          </View>
        ) : (
          orders.map(order => (
            <OrderCard
              key={order.orderId}
              order={order}
              onDetail={() =>
                navigation.navigate('MyOrderDetail', {
                  order,
                  member: route.params.member,
                })
              }
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  list: { flex: 1 },
  listContent: { padding: 16, gap: 12, paddingBottom: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 14,
  },
  cardTop: { flexDirection: 'row', gap: 14 },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 14,
  },
  thumbnailPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: '#f5f6fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailEmoji: { fontSize: 28 },
  cardBody: { flex: 1, gap: 6 },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    lineHeight: 22,
  },
  cardMeta: { fontSize: 13, color: '#888' },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  detailBtn: {
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  detailBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0076F0',
  },
  emptyBox: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyEmoji: { fontSize: 40 },
  emptyText: { fontSize: 15, color: '#aaa' },
});
