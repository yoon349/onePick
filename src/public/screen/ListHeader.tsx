// components/Header.tsx

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import {
    LIST_HEADER_HEIGHT,
    LIST_HEADER_PADDING_TOP,
} from '../../utils/screenLayout';



type Props = {
    title: string;
    count: number;
    onPressBack: () => void;
};

export default function ListHeader({
    title,
    count,
    onPressBack,
}: Props) {

    return (

        <View style={styles.header}>

            <View style={styles.btnView}>
                <TouchableOpacity
                    onPress={onPressBack}
                    style={styles.backBtn}
                >
                    <Text style={styles.backIcon}>
                        ←
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.textView}>
                <Text style={styles.headerTitle}>
                    {title}
                </Text>
                <Text style={styles.headerSub}>
                    {`총 ${count}건`}
                </Text>
            </View>

        </View>
    );
}


// ── 스타일 ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  header: {
    height: LIST_HEADER_HEIGHT,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: LIST_HEADER_PADDING_TOP,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  headerTitle: { 
    fontSize: 22, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 2
  },
  headerSub: {
    fontSize: 13, color: '#888'
  },
  btnView: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  textView: {
    alignSelf: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
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
});