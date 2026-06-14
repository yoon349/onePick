import { api } from '../axios';

export interface CreateProposalFundingRequest {
    content: string;
    price: number;
}

export const postProposalFunding = async (
    proposalId: number,
    body: CreateProposalFundingRequest,
) => {
    const response = await api.post(
        `/api/v1/proposals/${proposalId}/fundings`,
        body,
    );

    return response.data;
};

// 제작 제안 등록
