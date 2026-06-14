// MyOrderDetail.tsx — 주문 상태 상세

import axios from 'axios';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { patchProductionComplete } from '../../../api/Order/patchProductionComplete';
import { OrderStatus, ProposalOrder } from '../../../interface/order';
import { RootStackParamList } from '../../../navigation/StackNavigator';
import ListHeader from '../../../public/screen/ListHeader';
import {
  CATEGORY_LABELS,
  formatOrderAmount,
  getOrderStatusLabel,
  getOrderStatusStyle,
  ORDER_STEPS,
  orderStepIndex,
} from '../../../utils/orderStatus';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MyOrderDetail'>;
};

type MyOrderDetailRouteProp = RouteProp<RootStackParamList, 'MyOrderDetail'>;

function StatusTimeline({ status }: { status: OrderStatus }) {
  const currentIndex = orderStepIndex(status);

  return (
    <View style={styles.timeline}>
      {ORDER_STEPS.map((step, index) => {
        const isDone = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === ORDER_STEPS.length - 1;

        return (
          <View key={step} style={styles.stepRow}>
            <View style={styles.stepLeft}>
              <View
                style={[
                  styles.stepDot,
                  isDone && styles.stepDotDone,
                  isCurrent && styles.stepDotCurrent,
                ]}
              />
              {!isLast ? (
                <View style={[styles.stepLine, isDone && index < currentIndex && styles.stepLineDone]} />
              ) : null}
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepLabel, isCurrent && styles.stepLabelCurrent]}>
                {getOrderStatusLabel(step)}
              </Text>
              {isCurrent ? (
                <Text style={styles.stepHint}>현재 단계</Text>
              ) : isDone ? (
                <Text style={styles.stepHintDone}>완료</Text>
              ) : (
                <Text style={styles.stepHintPending}>대기</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default function MyOrderDetail({ navigation }: Props) {
  const route = useRoute<MyOrderDetailRouteProp>();
  const [order, setOrder] = useState<ProposalOrder>(route.params.order);
  const isCeo = route.params.member.type === 'CEO';

  useFocusEffect(
    useCallback(() => {
      setOrder(route.params.order);
    }, [route.params.order]),
  );

  const completeProduction = () => {
    Alert.alert('제작 완료', '제작 완료 처리하시겠습니까?', [
      { text: '아니오', style: 'cancel' },
      {
        text: '완료하기',
        onPress: async () => {
          try {
            await patchProductionComplete(Number(order.orderId));
            const updated = { ...order, orderStatus: 'PRODUCTION_DONE' as OrderStatus };
            setOrder(updated);
            navigation.setParams({ order: updated });
            Alert.alert('완료', '제작 완료 상태로 변경되었습니다.');
          } catch (error) {
            if (axios.isAxiosError(error)) {
              Alert.alert(
                '에러 발생',
                JSON.stringify(error.response?.data) || error.message,
              );
            } else {
              Alert.alert('에러 발생', '알 수 없는 오류');
            }
          }
        },
      },
    ]);
  };

  const statusStyle = getOrderStatusStyle(order.orderStatus);
  const thumbnailUrl = order.thumbnail?.imageUrl;

  return (
    <View style={styles.container}>
      <ListHeader
        title="주문 상세"
        count={1}
        onPressBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          {thumbnailUrl ? (
            <Image source={{ uri: encodeURI(thumbnailUrl) }} style={styles.thumbnail} />
          ) : (
            <View style={styles.thumbnailPlaceholder}>
              <Text style={styles.thumbnailEmoji}>📦</Text>
            </View>
          )}

          <Text style={styles.title}>{order.proposalTitle ?? '제목 없음'}</Text>
          <Text style={styles.category}>
            {CATEGORY_LABELS[order.proposalCategory] ?? order.proposalCategory}
          </Text>

          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusBadgeText, { color: statusStyle.color }]}>
              {getOrderStatusLabel(order.orderStatus)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>결제 금액</Text>
            <Text style={styles.infoValue}>
              {formatOrderAmount(order.paymentAmount ?? order.proposalFundingPrice)}
            </Text>
          </View>

          {order.writerNickname ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>작성자</Text>
              <Text style={styles.infoValue}>{order.writerNickname}</Text>
            </View>
          ) : null}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>주문 번호</Text>
            <Text style={styles.infoValue}>#{order.orderId}</Text>
          </View>
        </View>

        <View style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>주문 진행 현황</Text>
          <StatusTimeline status={order.orderStatus} />
        </View>

        {isCeo && order.orderStatus === 'PRODUCTION' ? (
          <TouchableOpacity style={styles.completeBtn} onPress={completeProduction}>
            <Text style={styles.completeBtnText}>제작 완료 처리</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 14, paddingBottom: 40 },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  thumbnail: {
    width: 88,
    height: 88,
    borderRadius: 16,
    marginBottom: 14,
  },
  thumbnailPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 16,
    backgroundColor: '#f5f6fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  thumbnailEmoji: { fontSize: 36 },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    textAlign: 'center',
    marginBottom: 6,
  },
  category: { fontSize: 13, color: '#888', marginBottom: 12 },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 16,
  },
  statusBadgeText: { fontSize: 13, fontWeight: '700' },
  infoRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  infoLabel: { fontSize: 14, color: '#888' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  timelineCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 20,
  },
  timeline: { gap: 0 },
  stepRow: { flexDirection: 'row', minHeight: 56 },
  stepLeft: { width: 24, alignItems: 'center' },
  stepDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#e5e7eb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  stepDotDone: {
    backgroundColor: '#0076F0',
    borderColor: '#0076F0',
  },
  stepDotCurrent: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#c7d2fe',
  },
  stepLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#e5e7eb',
    marginVertical: 2,
  },
  stepLineDone: { backgroundColor: '#0076F0' },
  stepContent: { flex: 1, paddingLeft: 12, paddingBottom: 16 },
  stepLabel: { fontSize: 15, fontWeight: '600', color: '#aaa' },
  stepLabelCurrent: { color: '#1a1a2e', fontWeight: '700' },
  stepHint: { fontSize: 12, color: '#0076F0', marginTop: 2, fontWeight: '600' },
  stepHintDone: { fontSize: 12, color: '#10b981', marginTop: 2 },
  stepHintPending: { fontSize: 12, color: '#ccc', marginTop: 2 },
  completeBtn: {
    backgroundColor: '#10b981',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  completeBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
