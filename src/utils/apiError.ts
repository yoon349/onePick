import axios from 'axios';

interface ApiErrorBody {
    message?: string;
    code?: string;
}

export const getApiErrorMessage = (error: unknown, fallback = '요청 처리 중 오류가 발생했습니다.'): string => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as ApiErrorBody | string | undefined;
        if (typeof data === 'string' && data.trim()) {
            return data;
        }
        if (data && typeof data === 'object' && data.message) {
            return data.message;
        }
        if (error.message) {
            return error.message;
        }
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
};
