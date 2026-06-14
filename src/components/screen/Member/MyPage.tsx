import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/StackNavigator';
import { RouteProp } from '@react-navigation/native';

import { useAuthStore } from '../../../store/useAuthStore';
import { requireSessionReady, clearSession } from '../../../api/axios';

import { styles } from './MyPageStyle';


type HomeScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type MyPageRouteProp =
    RouteProp<
        RootStackParamList,
        'MyPage'
    >;

type Props = {
  navigation: HomeScreenNavigationProp;
    route: MyPageRouteProp;
};


export default function Mypage({ navigation, route }: Props) {

    // 유저 정보
    const user = route.params;
    const isCEO = user.member.type === 'CEO';

    const clearMemberData = useAuthStore((member) => member.clearMemberData);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                await requireSessionReady();
            } catch {
                navigation.replace('Login');
                return;
            }
        };

        loadDashboard();
    }, [isCEO, navigation]);
    

    const handleLogout = () => {
        Alert.alert(
            '로그아웃',
            '로그아웃 하시겠습니까?',
            [
                {
                    text: '취소',
                    style: 'cancel',
                },
                {
                    text: '로그아웃',
                    style: 'destructive',
                    onPress: async () => {
                        clearMemberData();
                        await clearSession();
                        navigation.replace('Login');
                    },
                },
            ],
        );
    };

    return (

        <View style={styles.container}>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >

                {/* HEADER */}
                <View style={styles.header}>

                    <Text style={styles.headerTitle}>
                        👤 마이페이지
                    </Text>

                    <Text style={styles.headerSub}>
                        내 정보를 확인해 보세요
                    </Text>

                </View>


{/* PROFILE CARD */}
<View
    style={[styles.profileCard,
        isCEO ? styles.ibkDeepBlueView : styles.ibkBlueView]
    }
>

    {/* 상단 */}
    <View style={styles.profileTop}>

        {/* 프로필 원 */}
        {/*
        <View style={styles.profileCircle}>
            <Text style={styles.profileInitial}>
                {user.member.nickname.charAt(0)}
            </Text>
        </View>
        */}
        <View style={styles.profileWrapper}>
            { isCEO
                ? (
                    <Image
                        source={require('../../../assets/brand/logo-profile-deepblue.png')}
                        style={styles.profileImageDeepBlue}
                        resizeMode="cover"
                    />
                ) : (
                    <Image
                        source={require('../../../assets/brand/logo-profile-blue.png')}
                        style={styles.profileImageBlue}
                        resizeMode="cover"
                    />
                )
            }
        </View>

        {/* 유저 정보 */}
        <View style={styles.profileInfo}>

            <Text style={styles.profileName}>
                {user.member.nickname}
            </Text>

            <View style={styles.typeBadge}>

                <Text style={styles.typeBadgeText}>
                    {
                        user.member.type === 'CEO'
                            ? '기업회원'
                            : '개인회원'
                    }
                </Text>

            </View>

        </View>

    </View>

    {/* 하단 */}
    <TouchableOpacity
        style={styles.profilePaymentBox}
        onPress={() => navigation.navigate('Payment', {
            isPayment: false,
            productId: Number(null),
            quantity: Number(null),
        })}
    >
        <Text style={styles.profilePaymentText}>
            내 결제 수단
        </Text>
    </TouchableOpacity>

</View>

{/* HORIZONTAL DASHBOARD */}

<View style={styles.dashboardRow}>



            <TouchableOpacity
                style={styles.dashboardCard}
                onPress={
                    isCEO
                    ? () => navigation.navigate('AiProductPriceScreen')
                    : () => navigation.navigate('NewProposal')
                }
            >
                <Text style={styles.dashboardEmoji}>✏️</Text>
                { isCEO ?
                    (
                        <>
                        <Text style={[styles.dashboardTitle, styles.ibkDeepBlueText]}>
                            새로운 펀딩
                        </Text>
                        <Text style={[styles.dashboardTitle, styles.ibkDeepBlueText]}>모집하기</Text>
                        </>
                    )
                    :
                    (
                        <>
                        <Text style={[styles.dashboardTitle, styles.ibkBlueText]}>
                            새로운 제작
                        </Text>
                        <Text style={[styles.dashboardTitle, styles.ibkBlueText]}>요청하기</Text>
                        </>
                    )

                }

            </TouchableOpacity>

            <TouchableOpacity
                style={styles.dashboardCard}
                onPress={
                    isCEO
                    ? () => navigation.navigate('ProposalList')
                    : () => navigation.navigate('ProductFundingList')
                }
            >
                <Text style={styles.dashboardEmoji}>🛒</Text>
                { isCEO ?
                    (
                        <>
                        <Text style={[styles.dashboardTitle, styles.ibkDeepBlueText]}>
                            전체 제작 요청
                        </Text>
                        <Text style={[styles.dashboardTitle, styles.ibkDeepBlueText]}>보러 가기</Text>
                        </>
                    )
                    :
                    (
                        <>
                        <Text style={[styles.dashboardTitle, styles.ibkBlueText]}>
                            전체 펀딩 모집
                        </Text>
                        <Text style={[styles.dashboardTitle, styles.ibkBlueText]}>보러 가기</Text>
                        </>
                    )

                }

            </TouchableOpacity>
</View>



                    
                {/* MENU CARD */}
                <View style={styles.card}>

                    <Text style={styles.sectionTitle}>
                        ❤️ 내 활동
                    </Text>
                    
                   <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() =>
                            navigation.navigate('MyOrderList', { member: user.member })
                        }
                    >
                        <Text style={styles.menuText}>📦  내 주문 현황</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>

                    { isCEO ?
                        (<>
                            <TouchableOpacity
                                style={styles.menuButton}
                                onPress={() =>
                                    navigation.navigate('MyProductList')
                                }
                            >
                                <Text style={styles.menuText}>🙋🏻  내가 모집한 펀딩 현황</Text>
                                <Text style={styles.arrow}>›</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuButton}
                                onPress={() =>
                                    navigation.navigate('MyProposalFundingList')
                                }
                            >
                                <Text style={styles.menuText}>⭐️  내 제작 제안 현황</Text>
                                <Text style={styles.arrow}>›</Text>
                            </TouchableOpacity>
                        </>

                        ) : (

                        <>
                            <TouchableOpacity
                                style={styles.menuButton}
                                onPress={() =>
                                    navigation.navigate('MyProposalList')
                                }
                            >
                                <Text style={styles.menuText}>🙋🏻  내 주문제작 요청 현황</Text>
                                <Text style={styles.arrow}>›</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuButton}
                                onPress={() =>
                                    navigation.navigate('MyFundingList')
                                }
                            >
                                <Text style={styles.menuText}>⭐️  내가 참여한 펀딩 목록</Text>
                                <Text style={styles.arrow}>›</Text>
                            </TouchableOpacity>
                        </>
                        )
                    }
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutText}>로그아웃</Text>
                </TouchableOpacity>

            </ScrollView>

        </View>
    );
}