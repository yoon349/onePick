import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/StackNavigator';
import { RouteProp } from '@react-navigation/native';

import { getMyProducts } from '../../../api/Product/getMyProducts';
import { getMyFundings } from '../../../api/Product/getMyFundings';

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
    
    const [myProducts, setMyProducts] = useState<any[]>([]);
    const [myFundings, setMyFundings] = useState<any[]>([]);

    useEffect(() => {
        fetchMyProductList();
        fetchMyFundingList();
    }, []);
    
    const fetchMyProductList = async () => {
        try {
            const data = await getMyProducts();
            console.log(JSON.stringify(data, null, 2));
            
            if (Array.isArray(data)) {
                setMyProducts(data);
            } else if (Array.isArray(data.data)) {
                setMyProducts(data.data);
            } else {
                setMyProducts([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchMyFundingList = async () => {
        try {
            const data = await getMyFundings();
            console.log(JSON.stringify(data, null, 2));
            
            if (Array.isArray(data)) {
                setMyFundings(data);
            } else if (Array.isArray(data.data)) {
                setMyFundings(data.data);
            } else {
                setMyFundings([]);
            }

        } catch (error) {
            console.log(error);
        }
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
<View style={styles.profileCard}>

    {/* 상단 */}
    <View style={styles.profileTop}>

        {/* 프로필 원 */}
        <View style={styles.profileCircle}>
            <Text style={styles.profileInitial}>
                {user.member.nickname.charAt(0)}
            </Text>
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

{
    isCEO ? (

        <>

            <TouchableOpacity
                style={styles.dashboardCard}
                onPress={() =>
                    navigation.navigate('MyProductList')
                }
            >

                <Text style={styles.dashboardEmoji}>
                    📩
                </Text>

                <Text style={styles.dashboardTitle}>
                    내 펀딩 모집
                </Text>

                <Text style={styles.dashboardValue}>
                    {`${myProducts.filter( (mp) => mp.status === 'PENDING' ).length}건`}
                </Text>

            </TouchableOpacity>

            <TouchableOpacity
                style={styles.dashboardCard}
                onPress={() =>
                    navigation.navigate('MyProposalFundingList')
                }
            >

                <Text style={styles.dashboardEmoji}>
                    🛒
                </Text>

                <Text style={styles.dashboardTitle}>
                    내가 제안한
                </Text>

                <Text style={styles.dashboardValue}>
                    주문 제작
                </Text>

            </TouchableOpacity>

        </>

    ) : (

        <>

            <TouchableOpacity
                style={styles.dashboardCard}
                onPress={() =>
                    navigation.navigate('MyFundingList')
                }
            >

                <Text style={styles.dashboardEmoji}>
                    📩
                </Text>

                <Text style={styles.dashboardTitle}>
                    참여한 펀딩 모집
                </Text>

                <Text style={styles.dashboardValue}>
                    {`${myFundings.filter((mf) => mf.productStatus === 'PENDING' ).length}건`}
                </Text>

            </TouchableOpacity>

            <TouchableOpacity
                style={styles.dashboardCard}
                onPress={() =>
                    navigation.navigate('MyProposalList')
                }
            >

                <Text style={styles.dashboardEmoji}>
                    🛒
                </Text>

                <Text style={styles.dashboardTitle}>
                    내가 요청한
                </Text>

                <Text style={styles.dashboardValue}>
                    주문 제작
                </Text>

            </TouchableOpacity>

        </>

    )
}

</View>



                    
                {/* MENU CARD */}
                <View style={styles.card}>

                    <Text style={styles.sectionTitle}>
                        ⚙️ 메뉴
                    </Text>
                    
                   <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() =>
                            navigation.navigate('MyOrderList', { member: user.member })
                        }
                    >
                        <Text style={styles.menuText}>
                            📦 내 주문 현황
                        </Text>

                        <Text style={styles.arrow}>
                            ›
                        </Text>
                    </TouchableOpacity>

{
    isCEO ? (

        <>
            <TouchableOpacity
                style={styles.menuButton}
                onPress={() =>
                    navigation.navigate('NewProduct')
                }
            >
                <Text style={styles.menuText}>
                    📦 새 공동구매 모집
                </Text>

                <Text style={styles.arrow}>
                    ›
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.menuButton}
                onPress={() =>
                    navigation.navigate('ProposalList')
                }
            >
                <Text style={styles.menuText}>
                    🛒 전체 제작 요청 보러가기
                </Text>

                <Text style={styles.arrow}>
                    ›
                </Text>
            </TouchableOpacity>
        </>

    ) : (

        <>
            <TouchableOpacity
                style={styles.menuButton}
                onPress={() =>
                    navigation.navigate('NewProposal')
                }
            >
                <Text style={styles.menuText}>
                    📩 구매 요청 글 쓰기
                </Text>

                <Text style={styles.arrow}>
                    ›
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.menuButton}
                onPress={() =>
                    navigation.navigate('ProductFundingList')
                }
            >
                <Text style={styles.menuText}>
                    🛒 전체 펀딩 보러가기
                </Text>

                <Text style={styles.arrow}>
                    ›
                </Text>
            </TouchableOpacity>
        </>

    )
}

                </View>

            </ScrollView>

        </View>
    );
}