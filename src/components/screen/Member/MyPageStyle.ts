import { StyleSheet } from 'react-native';
import { SCREEN_HEADER_TOP } from '../../../utils/screenLayout';
import { brand } from '../../../public/style/colors';


export const styles = StyleSheet.create({

    ibkBlueView: {
        backgroundColor: brand.ibkBlue,
    },
    ibkDeepBlueView: {
        backgroundColor: brand.ibkDeepBlue,
    },
    ibkBlueText: {
        color: brand.ibkBlue,
    },
    ibkDeepBlueText: {
        color: brand.ibkDeepBlue,
    },
    ibkBlueBorder: {
        color: brand.ibkBlue,
    },
    ibkDeepBlueBorder: {
        color: brand.ibkDeepBlue,
    },

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
        marginTop: SCREEN_HEADER_TOP,
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

        marginBottom: 20,
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

        paddingVertical: 12,
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

profileWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
},

profileImageBlue: {
    bottom: 14,
    right: 14,
    width: '135%',
    height: '135%',
},

profileImageDeepBlue: {
    bottom: 16,
    right: 11,
    width: '140%',
    height: '140%',
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

    paddingVertical: 14,

    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 2,
},

dashboardEmoji: {
    marginBottom: 12,
    fontSize: 42,
},

dashboardTitle: {
    fontSize: 16,
    //color: '#666',
    fontWeight: 'bold',
    color: '#0076F0',
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

/*
hero: {
    backgroundColor: '#002B7F',

    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,

    paddingHorizontal: 24,
    paddingTop: SCREEN_HEADER_TOP + 10,
    paddingBottom: 36,

    marginHorizontal: -20,
},

heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},

memberBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',

    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius: 999,
},

memberBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
},

heroTitle: {
    marginTop: 26,

    fontSize: 38,
    lineHeight: 46,

    fontWeight: '800',

    color: '#fff',
},

heroSub: {
    marginTop: 14,

    color: 'rgba(255,255,255,0.7)',

    fontSize: 16,
},

profileCircle: {
    width: 56,
    height: 56,

    borderRadius: 999,

    backgroundColor: 'rgba(255,255,255,0.2)',

    justifyContent: 'center',
    alignItems: 'center',
},

profileInitial: {
    color: '#fff',

    fontSize: 24,
    fontWeight: '700',
},

actionCard: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#fff',

    borderRadius: 28,

    padding: 22,

    marginTop: 18,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 2,
},

actionIconBox: {
    width: 78,
    height: 78,

    borderRadius: 22,

    backgroundColor: '#EEF6FF',

    justifyContent: 'center',
    alignItems: 'center',
},

actionEmoji: {
    fontSize: 34,
},

actionContent: {
    marginLeft: 18,
},

actionTitle: {
    fontSize: 28,
    fontWeight: '800',

    color: '#0B2A6F',
},

actionDesc: {
    marginTop: 6,

    fontSize: 16,

    color: '#8C8C8C',
},

menuCard: {
    backgroundColor: '#F7F8FC',

    borderRadius: 24,

    marginTop: 24,

    paddingHorizontal: 20,
},

menuRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',
    alignItems: 'center',

    paddingVertical: 24,
},

menuRowText: {
    fontSize: 20,
    fontWeight: '700',

    color: '#23407A',
},

menuArrow: {
    fontSize: 28,
    color: '#B0B7C3',
},

menuDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
},
*/

    logoutButton: {
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: '#fff',

        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#e0e0e0',

        paddingVertical: 14,

        marginTop: 8,
    },

    logoutText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#e53935',
    },
});