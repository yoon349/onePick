import { Platform, StyleSheet } from 'react-native';
import { SCREEN_HEADER_TOP_COMPACT } from '../../../utils/screenLayout';

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
        marginTop: SCREEN_HEADER_TOP_COMPACT,
        flexDirection: 'row',
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
    
    headerView: {
        left: 10,
        marginBottom: 20,
        paddingTop: Platform.OS === 'ios' ? 10 : 0,
    },
    
    btnView: {
        alignItems: 'flex-start',
        marginTop: 10,
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
        backgroundColor: '#B6CAF3',
    },

    buttonText: {
        color: '#fff',

        fontSize: 16,
        fontWeight: '700',
    },

    imageUploadBox: {
    marginTop: 6,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',

    borderRadius: 16,

    paddingVertical: 26,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#fafafa',
},

imageUploadIcon: {
    fontSize: 28,
},

imageUploadText: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
},

imageUploadSub: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
},

previewRow: {
    marginTop: 14,
    gap: 10,
},

previewBox: {
    position: 'relative',
},

previewImage: {
    width: 90,
    height: 90,
    borderRadius: 14,
},

removeBtn: {
    position: 'absolute',
    top: -6,
    right: -6,

    width: 24,
    height: 24,

    borderRadius: 12,

    backgroundColor: '#ef4444',

    alignItems: 'center',
    justifyContent: 'center',
},

removeBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
},
});