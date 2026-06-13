import {
    api,
    clearSession,
    requireSessionReady,
    saveSessionFromResponse,
    SessionNotReadyError,
} from '../axios';
import { getMemorySessionId } from '../../utils/sessionStore';
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
    await clearSession();

    const response = await api.post<CommonResponse<LoginResponse>>(
        '/api/v1/member/login',
        body,
        { withCredentials: true },
    );

    const data = response.data;

    if (!data.success || !data.data) {
        return data;
    }

    const sessionSaved = await saveSessionFromResponse(response);
    if (!sessionSaved || !getMemorySessionId()) {
        throw new SessionNotReadyError(
            '로그인은 성공했지만 세션을 저장하지 못했습니다. 다시 시도해 주세요.',
        );
    }

    await requireSessionReady();
    return data;
};
