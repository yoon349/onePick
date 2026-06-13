import { api } from '../axios';

type ProposalFundingItem = {
    price?: number | null;
};

export const sortFundingsByPriceAsc = <T extends ProposalFundingItem>(fundings: T[]): T[] =>
    [...fundings].sort(
        (left, right) => (Number(left.price) || 0) - (Number(right.price) || 0),
    );

export const getFundings = async (proposalId: number) => {
    const response = await api.get(`/api/v1/proposals/${proposalId}/fundings`);
    const body = response.data;

    if (body && Array.isArray(body.data)) {
        return {
            ...body,
            data: sortFundingsByPriceAsc(body.data),
        };
    }

    return body;
};

// 입찰 요청 목록 조회