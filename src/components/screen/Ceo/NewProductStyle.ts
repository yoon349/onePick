import { StyleSheet } from 'react-native';

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
        left: 15,
        marginTop: 50,
        //marginBottom: 24,
        marginBottom: 20,
        paddingTop: 10,
    },

    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a2e',
        marginBottom: 6,
    },

    headerSub: {
        fontSize: 14,
        color: '#666',
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,

        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10,

        elevation: 3,

        marginBottom: 20,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a2e',
        marginBottom: 20,
    },

    inputGroup: {
        marginBottom: 18,
    },

    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
        marginBottom: 8,
    },

    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',

        borderRadius: 12,

        paddingHorizontal: 14,
        paddingVertical: 12,

        fontSize: 14,

        color: '#222',
        backgroundColor: '#fafafa',
    },

    dropdown: {
        height: 58,

        borderWidth: 1,
        borderColor: '#e0e0e0',

        borderRadius: 12,

        paddingHorizontal: 14,

        backgroundColor: '#fafafa',
    },

    dropdownContainer: {
        borderRadius: 12,

        borderColor: '#e0e0e0',

        overflow: 'hidden',
    },

    dropdownPlaceholder: {
        color: '#999',

        fontSize: 14,
    },

    dropdownSelectedText: {
        color: '#222',

        fontSize: 14,

        fontWeight: '500',
    },

    dropdownItemText: {
        color: '#222',

        fontSize: 14,
    },

    button: {
        backgroundColor: '#0076F0',

        borderRadius: 16,

        paddingVertical: 18,

        alignItems: 'center',
    },

    buttonDisabled: {
        backgroundColor: '#a5b4fc',
    },

    buttonText: {
        color: '#fff',

        fontSize: 16,
        fontWeight: '700',
    },
});