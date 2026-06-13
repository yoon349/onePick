import axios from 'axios';
import CookieManager from '../utils/cookieManager';

export const API_BASE_URL = 'http://13.209.73.31:8080';

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

const persistSetCookieHeader = async (setCookieHeader: string | string[] | undefined) => {
    if (!setCookieHeader) {
        return;
    }

    const cookieHeader = Array.isArray(setCookieHeader) ? setCookieHeader[0] : setCookieHeader;
    if (!cookieHeader) {
        return;
    }

    await CookieManager.setFromResponse(API_BASE_URL, cookieHeader);
};

export const getJSessionId = async (): Promise<string | null> => {
    const cookies = await CookieManager.get(API_BASE_URL);
    return cookies?.JSESSIONID?.value ?? null;
};

export const getSessionHeaders = async (): Promise<Record<string, string>> => {
    const jsessionid = await getJSessionId();
    return jsessionid ? { Cookie: `JSESSIONID=${jsessionid}` } : {};
};

api.interceptors.request.use(async (config) => {
    const sessionHeaders = await getSessionHeaders();
    Object.assign(config.headers, sessionHeaders);
    return config;
});

api.interceptors.response.use(
    async (response) => {
        const setCookieHeader =
            response.headers['set-cookie'] ?? response.headers['Set-Cookie'];
        await persistSetCookieHeader(setCookieHeader);
        return response;
    },
    async (error) => {
        const setCookieHeader =
            error.response?.headers?.['set-cookie'] ??
            error.response?.headers?.['Set-Cookie'];
        await persistSetCookieHeader(setCookieHeader);
        return Promise.reject(error);
    },
);
