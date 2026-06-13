import { Alert, PermissionsAndroid, Platform } from 'react-native';
import {
    Asset,
    launchImageLibrary,
    ImageLibraryOptions,
} from 'react-native-image-picker';

const requestAndroidPhotoPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android' || Platform.Version < 23) {
        return true;
    }

    const permission =
        Platform.Version >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const alreadyGranted = await PermissionsAndroid.check(permission);
    if (alreadyGranted) {
        return true;
    }

    const result = await PermissionsAndroid.request(permission, {
        title: '사진 접근 권한',
        message: '제작 요청에 상품 이미지를 등록하려면 사진 보관함 접근 권한이 필요합니다.',
        buttonPositive: '허용',
        buttonNegative: '거부',
    });

    return result === PermissionsAndroid.RESULTS.GRANTED;
};

export const pickImagesFromLibrary = async (
    selectionLimit = 5,
    options: Partial<ImageLibraryOptions> = {},
): Promise<Asset[]> => {
    const permitted = await requestAndroidPhotoPermission();
    if (!permitted) {
        Alert.alert('권한 필요', '사진 보관함 접근 권한을 허용해 주세요.');
        return [];
    }

    const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit,
        presentationStyle: 'fullScreen',
        ...options,
    });

    if (result.didCancel) {
        return [];
    }

    if (result.errorCode) {
        Alert.alert(
            '이미지 선택 실패',
            result.errorMessage ?? '사진을 불러오지 못했습니다.',
        );
        return [];
    }

    return result.assets ?? [];
};
