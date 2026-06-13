// PaymentStyle.ts

import { StyleSheet } from 'react-native';
import { SCREEN_HEADER_TOP } from '../../utils/screenLayout';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
    },

    scroll: {
        padding: 20,
        paddingBottom: 40,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: SCREEN_HEADER_TOP,
        marginBottom: 24,
        gap: 8,
    },

    backBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    backIcon: {
        fontSize: 28,
        color: '#1a1a2e',
    },

    headerTextWrap: {
        flex: 1,
    },

    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1a1a2e',
    },

    headerSub: {
        marginTop: 8,

        fontSize: 15,
        color: '#888',
    },

    card: {
        backgroundColor: '#fff',

        borderRadius: 26,

        padding: 20,

        marginBottom: 20,

        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,

        elevation: 3,
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 18,
    },

    sectionEmoji: {
        fontSize: 22,
        marginRight: 8,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a2e',
    },

    paymentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        paddingVertical: 18,
        paddingHorizontal: 18,

        borderRadius: 18,

        backgroundColor: '#f8fafc',

        marginBottom: 12,
    },

    paymentItemSelected: {
        borderWidth: 2,
        borderColor: '#0076F0',

        backgroundColor: '#eef2ff',
    },

    paymentName: {
        fontSize: 16,
        fontWeight: '700',

        color: '#1a1a2e',
    },

    paymentSub: {
        marginTop: 4,

        fontSize: 13,
        color: '#777',
    },

    check: {
        fontSize: 22,
        fontWeight: 'bold',

        color: '#0076F0',
    },

    button: {
        height: 60,

        backgroundColor: '#0076F0',

        borderRadius: 18,

        justifyContent: 'center',
        alignItems: 'center',

        marginTop: 10,
    },

    buttonDisabled: {

        backgroundColor: '#a5b4fc',
        
    },

    buttonText: {
        color: '#fff',

        fontSize: 17,
        fontWeight: '700',
    },
});