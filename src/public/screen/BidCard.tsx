// components/BidCard.tsx

import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import { bid } from '../../interface/bid';



// ── 타입 정의 ──────────────────────────────────────────────
export type BidCategory = 'FOOD' | 'FURNITURE' | 'DIGITAL' | 'FASHION' | 'BEAUTY' | 'ETC';

// ── 카테고리 ──────────────────────────────────────────────
function Categories({ category }: { category: BidCategory }) {
  const config = {
    FOOD:    { label: '음식', },
    FURNITURE:    { label: '가구', },
    DIGITAL:    { label: '전자기기', },
    FASHION:    { label: '패션/의류', },
    BEAUTY:    { label: '뷰티', },
    ETC:    { label: '기타', },
  }[category];

  return (
    <Text style={styles.categoryText}>|  {config.label}</Text>
  );
}


export default function BidCard({
    id,
    title,
    category,
    valueString,
    thumbnail,
    remainingDeadlineDays,
    buttonView,
    onPressNav,
}: bid) {

    return (

        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={onPressNav}
        >

        {/* 왼쪽 이모지 */}
        <View style={styles.cardEmoji}>
            {thumbnail !== null ?
            <Image
                source={{ uri: thumbnail }}
                style={styles.cardImage}
            /> :
            <Text style={styles.emojiText}>❌</Text>}
        </View>

        {/* 중앙 정보 */}
        <View style={styles.cardContent}>
            <View style={styles.cardTopRow}>
                <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
                <Categories category={category}/>

                {/*<StatusBadge status={bid.productStatus} />*/}
            </View>
        <Text style={styles.bidAmount}>{valueString}</Text>

        <View style={styles.cardBottomRow}>
            <Text style={styles.dateText}>
                📅 {
                    remainingDeadlineDays > 0
                        ? `${remainingDeadlineDays}일 남음`
                            : remainingDeadlineDays === 0
                                ? '오늘 마감'
                                    : `${Math.abs(remainingDeadlineDays)}일 경과`
                }
            </Text>
            {buttonView}
        </View>
        
      </View>
    </TouchableOpacity>
  );
}



// ── 스타일 ─────────────────────────────────────────────────
const styles = StyleSheet.create({
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
    cardTopRow:   {
        flexDirection: 'row',
    },
    titleText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a2e',
    },

    categoryText: {
        marginTop: 2,
        marginLeft: 10,
        fontSize: 12,
        color: 'gray',
        fontWeight: '600',
    },


  bidAmount:    { fontSize: 18, fontWeight: 'bold', color: '#0076F0' },
    cardBottomRow:{
        height: 25,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        //backgroundColor: 'red'
    },
    dateText: {
      paddingTop: 8,
      marginRight: 10,
      fontSize: 12,
      color: '#737684'
    },
  remainUrgent: { color: '#ef4444' },
  endDateText:  { fontSize: 12, color: '#aaa' },
});