import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Alert, Text, TouchableOpacity, View, Image, ScrollView, TextInput } from 'react-native'
import { styles, text } from './product/NewProductScreenStyle.ts'
import { buttonStyle, buttonText }  from '../public/style/button.ts'
import { Picker } from '@react-native-picker/picker'

import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/StackNavigator.tsx'

import { postProduct } from '../api/Product/postProduct.ts'

type HomeScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type Props = {
  navigation: HomeScreenNavigationProp;
};



const categories = [

    {
        label: '음식',
        value: 'FOOD',
    },
    {
        label: '가구',
        value: 'FURNITURE',
    },
    {
        label: '전자기기',
        value: 'DIGITAL',
    },
    {
        label: '의류/패션',
        value: 'FASHION',
    },
    {
        label: '미용',
        value: 'BEAUTY',
    },
    {
        label: '기타',
        value: 'ETC.',
    },
];


export default function NewPost({ navigation }: Props) {

    const [fulfilled, setFulfilled] = useState(false)

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [price, setPrice] = useState('')
    const [minPeople, setMinPeople] = useState('')
    const [deadlineDays, setDeadlineDays] = useState('')
    const [category, setCategory] = useState('FOOD')


    useEffect(() => {
        const isFilled =
            title.trim() !== '' &&
            content.trim() !== '' &&
            price.trim() !== '' &&
            minPeople.trim() !== '' &&
            deadlineDays.trim() !== '' &&
            category.trim() !== '';
            
        setFulfilled(isFilled);
    }, [title, content, price, minPeople, deadlineDays, category]);


    const handleSubmit = async () => {

        try {
            const body = {
                title,
                content,
                price: Number(price),
                minPeople: Number(minPeople),
                deadlineDays: Number(deadlineDays),
                category,
            };

            console.log(body);

            const result = await postProduct(body);
            console.log(result);
            Alert.alert(
            '등록 완료',
            '상품이 성공적으로 등록되었습니다.'
            );
            navigation.navigator('MyPage');

        } catch (error) {

            if (axios.isAxiosError(error)) {

                Alert.alert(
                    '에러 발생',
                    error.response?.data?.message
                    || '상품 등록 실패',
                );

                } else {
                    Alert.alert(
                        '에러 발생',
                        '알 수 없는 오류',
                );
            }
        }
    };

    
    return (
        <View style={styles.flex}>
        <View style={styles.header}>
            <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => {navigation.goBack()}}>
                <Image
                    source={require('../../public/assets/back.png')}
                    style={styles.iconBack}
                />
            </TouchableOpacity>
            <Text style={text.headerText}>NEW POST</Text>
            </View>
        </View>

        <View style={styles.main}>
            <ScrollView style={styles.scrollView}>

                <View style={[styles.mainContainer, {}]}>
                    <TextInput
                        style={text.placeholderText}
                        placeholder='제목'
                        maxLength={20}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                <View style={[styles.mainContainer, { height: 100 }]}>
                    <TextInput
                        style={text.placeholderText}
                        placeholder='상품 설명'
                        multiline
                        maxLength={100}
                        value={content}
                        onChangeText={setContent}
                    />
                </View>

                <View style={styles.mainContainer}>
                    <TextInput
                        style={text.placeholderText}
                        placeholder='가격'
                        keyboardType='numeric'
                        value={price}
                        onChangeText={setPrice}
                    />
                </View>

                <View style={styles.mainContainer}>
                    <TextInput
                        style={text.placeholderText}
                        placeholder='최소 인원수'
                        keyboardType='numeric'
                        value={minPeople}
                        onChangeText={setMinPeople}
                    />
                </View>

                <View style={styles.mainContainer}>
                    <TextInput
                        style={text.placeholderText}
                        placeholder='기한 수(일단위)'
                        keyboardType='numeric'
                        value={deadlineDays}
                        onChangeText={setDeadlineDays}
                    />
                </View>

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={category}
                        onValueChange={(itemValue) => setCategory(itemValue)}
                        style={{ color: 'black' }}
                    >
                        {categories.map((item) => (
                            <Picker.Item
                                key={item.value}
                                label={item.label}
                                value={item.value}
                            />
                        ))}
                    </Picker>
                </View>
                
                <TouchableOpacity
                    disabled={!fulfilled}
                    style={fulfilled ? buttonStyle.active : buttonStyle.inactive}
                    onPress={handleSubmit}
                >
                    <Text style={fulfilled ? buttonText.active : buttonText.inactive}>완료</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
        <View style={styles.footer}>
            <Text style={text.headerText}>FOOTER</Text>
        </View>
    </View>
  );
}
