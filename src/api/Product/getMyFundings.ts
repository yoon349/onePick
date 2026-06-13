import { api, getSessionHeaders, requireSessionReady } from '../axios';

export const getMyFundings = async () => {
    await requireSessionReady();
    const sessionHeaders = await getSessionHeaders();

    const response = await api.get(`/api/v1/product/fundings/me`, {
        headers: sessionHeaders,
    });

    return response.data;
};

// 내 펀딩 참여 목록 조회
