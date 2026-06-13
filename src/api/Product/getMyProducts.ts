import { api, getSessionHeaders, requireSessionReady } from '../axios';

export const getMyProducts = async () => {
    await requireSessionReady();
    const sessionHeaders = await getSessionHeaders();

    const response = await api.get(`/api/v1/product/me`, {
        headers: sessionHeaders,
    });

    return response.data;
};

// 내 펀딩 모집 글 목록 조회
