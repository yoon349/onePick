import { api } from '../axios';

// 요청 body 타입
export interface UpdateProposalFundingRequest {
    price: number,
    content: string,
}

export const patchProposalFunding = async (proposalFundingId: number, body: UpdateProposalFundingRequest) => {
    const response = await api.patch(
        `/api/v1/proposals/fundings/${proposalFundingId}`,
        body
    );

    return response.data;
};

// 입찰 요청 수정