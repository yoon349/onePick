// LoginStyle.ts


import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
        justifyContent: 'space-between',
    },

    content: {
        flex: 1,

        justifyContent: 'center',

        paddingHorizontal: 24,
    },

    titleBox: {
        marginBottom: 40,
    },

    title: {
        fontSize: 36,
        fontWeight: 'bold',

        lineHeight: 48,

        color: '#1a1a2e',
    },

    subTitle: {
        marginTop: 12,

        fontSize: 16,
        color: '#888',
    },

    card: {
        backgroundColor: '#fff',

        borderRadius: 24,

        padding: 24,

        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,

        elevation: 2,
    },

    inputLabel: {
        fontSize: 15,
        fontWeight: '600',

        color: '#1a1a2e',

        marginBottom: 10,
    },

    input: {
        height: 56,

        borderWidth: 1,
        borderColor: '#e5e7eb',

        borderRadius: 14,

        paddingHorizontal: 16,

        fontSize: 16,

        color: '#1a1a2e',

        backgroundColor: '#fafafa',
    },

    button: {
        backgroundColor: '#0076F0',

        marginHorizontal: 24,
        marginBottom: 36,

        height: 58,

        borderRadius: 16,

        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonDisabled: {
        backgroundColor: '#c7c9d9',
    },

    buttonText: {
        color: '#fff',

        fontSize: 17,
        fontWeight: '700',
    },
});