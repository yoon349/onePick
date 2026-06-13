import { api, getSessionHeaders, requireSessionReady } from '../axios';

export const getMyProposals = async () => {
    await requireSessionReady();
    const sessionHeaders = await getSessionHeaders();

    const response = await api.get(`/api/v1/proposals/me`, {
        headers: sessionHeaders,
    });

    return response.data;
};

// 내 구매 요청 글 목록 조회
