import { Platform } from 'react-native';

/** 마이페이지·결제 등 큰 헤더 상단 여백 (iOS 노치 대응) */
export const SCREEN_HEADER_TOP =
  Platform.select({
    ios: 65,
    android: 16,
    default: 16,
  }) ?? 16;

/** 뒤로가기 목록·등록 폼 헤더 상단 여백 */
export const SCREEN_HEADER_TOP_COMPACT =
  Platform.select({
    ios: 50,
    android: 16,
    default: 16,
  }) ?? 16;

/** ListHeader 상단 패딩 */
export const LIST_HEADER_PADDING_TOP =
  Platform.select({
    ios: 50,
    android: 16,
    default: 16,
  }) ?? 16;

/** ListHeader 전체 높이 */
export const LIST_HEADER_HEIGHT =
  Platform.select({
    ios: 140,
    android: 96,
    default: 96,
  }) ?? 96;
