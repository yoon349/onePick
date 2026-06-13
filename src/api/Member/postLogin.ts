import { api } from '../axios';
import { CommonResponse } from '../types';

export interface CreateLoginRequest {
    phoneNumber: string;
}

export interface LoginResponse {
    memberId: number;
    nickname: string;
    type: string;
}

export const postLogin = async (body: CreateLoginRequest): Promise<CommonResponse<LoginResponse>> => {
    const response = await api.post<CommonResponse<LoginResponse>>(
        '/api/v1/member/login',
        body,
    );

    return response.data;
};
