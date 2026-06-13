import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


type BidStatus = 'PENDING' | 'FINISHED' | 'CANCELED';

const BADGES: {
    key: BidStatus;
    label: string;
    color: string;
}[] = [
    {
        key: 'PENDING',
        label: '진행중',
        color: '#0076F0',
    },
    {
        key: 'FINISHED',
        label: '종료',
        color: '#10b981',
    },
    {
        key: 'CANCELED',
        label: '취소',
        color: '#ef4444',
    },
];


export default function StatusBadge({ status }: { status: BidStatus }) {

    const badge = BADGES.find(
        item => item.key === status,
    );

    if (!badge) return null;

    return (
        <View
            style={[
                styles.badge,
                {
                    backgroundColor: badge.color,
                },
            ]}
        >
            <Text style={styles.badgeText}>
                {badge.label}
            </Text>
        </View>
    );
}


const styles = StyleSheet.create({

    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },

    badgeText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },

});