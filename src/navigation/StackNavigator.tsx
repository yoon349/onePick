import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'


import Login from '../components/screen/Member/Login'
import MyPage from '../components/screen/Member/MyPage'
import SplashScreen from '../components/screen/SplashScreen'

import NewProposal from '../components/screen/Individual/NewProposal'
import ProposalSketchScreen from '../components/screen/Individual/ProposalSketchScreen'
import ProductFundingList from '../components/screen/Individual/ProductFundingList'
import ProductFundingDetail from '../components/screen/Individual/ProductFundingDetail'
import MyFundingList from '../components/screen/Individual/MyFundingList'
import MyProposalList from '../components/screen/Individual/MyProposalList'
import ProposalPayment from '../components/screen/Individual/ProposalPayment'

import NewProduct from '../components/screen/Ceo/NewProduct'
import AiProductPriceScreen from '../components/screen/Ceo/AiProductPriceScreen'
import AiLoadingScreen from '../components/screen/Ceo/AiLoadingScreen'
import ProposalList from '../components/screen/Ceo/ProposalList'
import ProposalDetail from '../components/screen/Ceo/ProposalDetail'
import MyProductList from '../components/screen/Ceo/MyProductList'
import MyProposalFundingList from '../components/screen/Ceo/MyProposalFundingList'
import MyProposalFundingDetail from '../components/screen/Ceo/MyProposalFundingDetail'

import Payment from '../components/screen/Payment'

import MyOrderList from '../components/screen/Order/MyOrderList'
import MyOrderDetail from '../components/screen/Order/MyOrderDetail'

import GongguAIScreen from '../components/screen/Ai/GongguAIScreen'
import OrderParserScreen from '../components/screen/Ai/OrderParserScreen'
import RecommendScreen from '../components/screen/Ai/RecommendScreen'
import Sketch2ProductScreen from '../components/screen/Ai/Sketch2ProductScreen'

import { Member } from '../interface/member'
import { ProposalOrder } from '../interface/order'


export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  MyPage: {
    member: Member;
  };

  Payment: {
    isPayment: boolean;
    productId: number;
    quantity: number;
  };

  MyOrderList: {
    member: Member;
  };

  MyOrderDetail: {
    order: ProposalOrder;
    member: Member;
  };

  NewProposal: {
    sketchB64?: string;
    sketchPrompt?: string;
  } | undefined;
  ProposalSketchScreen: {
    initialPrompt?: string;
  };
  ProductFundingList: undefined;
  ProductFundingDetail: {
    isMine: boolean,
    productId: number,
  };
  MyFundingList: undefined;
  MyProposalList: undefined;
  ProposalPayment: {
    proposalFundingId: number,
  };

  NewProduct: {
    aiPrice?: number | null;
    aiDescription?: string | null;
    aiProductId?: number | null;
    productName?: string;
  } | undefined;
  AiProductPriceScreen: undefined;
  AiLoadingScreen: {
    jobId: string;
    productId: number;
    name: string;
  };
  ProposalList: undefined;
  ProposalDetail: {
    isMine: boolean,
    proposalId: number,
  };
  MyProductList: undefined;
  MyProposalFundingList: undefined;
  MyProposalFundingDetail: {
    proposalId: number,
    proposalFundingId: number,
  };

  GongguAIScreen: undefined;
  OrderParserScreen: undefined;
  RecommendScreen: undefined;
  Sketch2ProductScreen: undefined;

};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
      />
      <Stack.Screen
        name="Login"
        component={Login}
      />
      <Stack.Screen
        name="MyPage"
        component={MyPage}
      />


      <Stack.Screen
        name="Payment"
        component={Payment}
      />

      <Stack.Screen
        name="MyOrderList"
        component={MyOrderList}
      />

      <Stack.Screen
        name="MyOrderDetail"
        component={MyOrderDetail}
      />


      <Stack.Screen
        name="NewProposal"
        component={NewProposal}
      />
      <Stack.Screen
        name="ProposalSketchScreen"
        component={ProposalSketchScreen}
      />
      <Stack.Screen
        name="ProductFundingList"
        component={ProductFundingList}
      />
      <Stack.Screen
        name="ProductFundingDetail"
        component={ProductFundingDetail}
      />
      <Stack.Screen
        name="MyFundingList"
        component={MyFundingList}
      />
      <Stack.Screen
        name="MyProposalList"
        component={MyProposalList}
      />
      <Stack.Screen
        name="ProposalPayment"
        component={ProposalPayment}
      />


      <Stack.Screen
        name="NewProduct"
        component={NewProduct}
      />
      <Stack.Screen
        name="AiProductPriceScreen"
        component={AiProductPriceScreen}
      />
      <Stack.Screen
        name="AiLoadingScreen"
        component={AiLoadingScreen}
      />
      <Stack.Screen
        name="ProposalList"
        component={ProposalList}
      />
      <Stack.Screen
        name="ProposalDetail"
        component={ProposalDetail}
      />
      <Stack.Screen
        name="MyProductList"
        component={MyProductList}
      />
      <Stack.Screen
        name="MyProposalFundingList"
        component={MyProposalFundingList}
      />
      <Stack.Screen
        name="MyProposalFundingDetail"
        component={MyProposalFundingDetail}
      />
      

      <Stack.Screen
        name="GongguAIScreen"
        component={GongguAIScreen}
      />
      <Stack.Screen
        name="OrderParserScreen"
        component={OrderParserScreen}
      />
      <Stack.Screen
        name="RecommendScreen"
        component={RecommendScreen}
      />
      <Stack.Screen
        name="Sketch2ProductScreen"
        component={Sketch2ProductScreen}
      />

    </Stack.Navigator>
  );
}