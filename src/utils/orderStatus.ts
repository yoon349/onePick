import { OrderStatus } from '../interface/order';

export const ORDER_STEPS: OrderStatus[] = [
  'PRODUCTION',
  'PRODUCTION_DONE',
  'SHIPPING',
  'DELIVERED',
];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PRODUCTION: '제작중',
  PRODUCTION_DONE: '제작완료',
  SHIPPING: '배송중',
  DELIVERED: '배송완료',
};

export const ORDER_STATUS_STYLE: Record<OrderStatus, { bg: string; color: string }> = {
  PRODUCTION: { bg: '#eef2ff', color: '#0076F0' },
  PRODUCTION_DONE: { bg: '#e0f2fe', color: '#0369a1' },
  SHIPPING: { bg: '#fef3c7', color: '#b45309' },
  DELIVERED: { bg: '#d1fae5', color: '#065f46' },
};

export const CATEGORY_LABELS: Record<string, string> = {
  FOOD: '식품',
  FURNITURE: '가구',
  DIGITAL: '디지털',
  FASHION: '패션',
  BEAUTY: '뷰티',
  ETC: '기타',
};

export function orderStepIndex(status: OrderStatus | undefined): number {
  if (!status) {
    return 0;
  }
  const index = ORDER_STEPS.indexOf(status);
  return index >= 0 ? index : 0;
}

export function formatOrderAmount(amount?: number | null): string {
  return `${Number(amount ?? 0).toLocaleString()}원`;
}

export function getOrderStatusStyle(status?: OrderStatus) {
  if (status && ORDER_STATUS_STYLE[status]) {
    return ORDER_STATUS_STYLE[status];
  }
  return ORDER_STATUS_STYLE.PRODUCTION;
}

export function getOrderStatusLabel(status?: OrderStatus): string {
  if (status && ORDER_STATUS_LABEL[status]) {
    return ORDER_STATUS_LABEL[status];
  }
  return '상태 미확인';
}
