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
        marginTop: 65,
        marginBottom: 20,
    },

    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a2e',
    },

    headerSub: {
        marginTop: 6,
        fontSize: 14,
        color: '#888',
    },

    card: {
        backgroundColor: '#fff',

        borderRadius: 20,

        padding: 20,

        marginBottom: 18,

        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,

        elevation: 2,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a2e',

        marginBottom: 18,
    },

    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    infoLabel: {
        fontSize: 15,
        color: '#666',
    },

    infoValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0076F0',
    },

    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',

        marginVertical: 16,
    },

    menuButton: {
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'space-between',

        backgroundColor: '#f8fafc',

        borderRadius: 14,

        paddingVertical: 18,
        paddingHorizontal: 16,

        marginBottom: 12,
    },

    menuText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1a1a2e',
    },

    arrow: {
        fontSize: 24,
        color: '#aaa',
    },
    

    profileCard: {
    backgroundColor: '#0076F0',

    borderRadius: 28,

    padding: 24,

    marginBottom: 20,

    shadowColor: '#0076F0',
    shadowOpacity: 0.25,
    shadowRadius: 12,

    elevation: 6,
},

profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
},

profileCircle: {
    width: 72,
    height: 72,

    borderRadius: 36,

    backgroundColor: 'rgba(255,255,255,0.2)',

    justifyContent: 'center',
    alignItems: 'center',
},

profileInitial: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
},

profileInfo: {
    marginLeft: 18,
    flex: 1,
},

profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
},

typeBadge: {
    alignSelf: 'flex-start',

    marginTop: 10,

    backgroundColor: 'rgba(255,255,255,0.18)',

    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius: 999,
},

typeBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
},

profileBottom: {
    flexDirection: 'row',

    marginTop: 24,

    backgroundColor: 'rgba(255,255,255,0.08)',

    borderRadius: 18,

    paddingVertical: 18,
},

profileStatBox: {
    flex: 1,
    alignItems: 'center',
},

profileStatLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
},

profileStatValue: {
    marginTop: 6,

    color: '#fff',

    fontSize: 16,
    fontWeight: '700',
},

profileDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
},

dashboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginBottom: 18,
},

dashboardCard: {
    width: '48%',

    backgroundColor: '#fff',

    borderRadius: 22,

    paddingVertical: 24,

    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 2,
},

dashboardEmoji: {
    fontSize: 28,
},

dashboardTitle: {
    marginTop: 10,

    fontSize: 14,
    color: '#666',
},

dashboardValue: {
    marginTop: 6,

    fontSize: 24,
    fontWeight: 'bold',

    color: '#0076F0',
},

profilePaymentBox: {
    alignItems: 'center',

    marginTop: 24,

    backgroundColor: 'rgba(255,255,255,0.08)',

    borderRadius: 18,

    paddingVertical: 18,

    justifyContent: 'center',
},



profilePaymentText: {
    
    color: '#fff',

    fontSize: 16,
    fontWeight: '500',
},
});