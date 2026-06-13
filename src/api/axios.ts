import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import CookieManager from '../utils/cookieManager';
import {
    getMemorySessionId,
    parseJSessionId,
    setMemorySessionId,
    sleep,
} from '../utils/sessionStore';

export const API_BASE_URL = 'http://13.209.73.31:8080';
const API_HOST = '13.209.73.31';

export class SessionNotReadyError extends Error {
    constructor(message = '로그인 세션을 저장하지 못했습니다.') {
        super(message);
        this.name = 'SessionNotReadyError';
    }
}

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    // RN iOS/Android: rely on explicit Cookie header from memory, not native jar sync.
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

const applyRequestHeader = (
    config: InternalAxiosRequestConfig,
    key: string,
    value: string,
): void => {
    if (typeof config.headers.set === 'function') {
        config.headers.set(key, value);
        return;
    }

    config.headers[key] = value;
};

const extractSetCookieHeader = (response: AxiosResponse | Response): string | undefined => {
    if (response instanceof Response) {
        const directHeader =
            response.headers.get('set-cookie') ??
            response.headers.get('Set-Cookie');
        if (directHeader) {
            return directHeader;
        }

        const collected: string[] = [];
        response.headers.forEach((value, key) => {
            if (key.toLowerCase() === 'set-cookie') {
                collected.push(value);
            }
        });
        if (collected.length > 0) {
            return collected[0];
        }

        return undefined;
    }

    const headers = response.headers as AxiosResponse['headers'] & {
        getSetCookie?: () => string[];
    };

    if (typeof headers.getSetCookie === 'function') {
        const cookies = headers.getSetCookie();
        if (cookies.length > 0) {
            return cookies[0];
        }
    }

    const request = response.request as {
        responseHeaders?: Record<string, string>;
        _lowerCaseResponseHeaders?: Record<string, string>;
    };

    const normalized =
        headers['set-cookie'] ??
        headers['Set-Cookie'] ??
        request?.responseHeaders?.['Set-Cookie'] ??
        request?._lowerCaseResponseHeaders?.['set-cookie'];

    if (Array.isArray(normalized)) {
        return normalized[0];
    }

    return typeof normalized === 'string' ? normalized : undefined;
};

const persistSessionCookie = async (
    sessionId: string,
    setCookieHeader?: string,
): Promise<void> => {
    if (setCookieHeader) {
        try {
            await CookieManager.setFromResponse(API_BASE_URL, setCookieHeader);
        } catch {
            // Fall through to explicit set below.
        }
    }

    if (CookieManager.set) {
        await CookieManager.set(API_BASE_URL, {
            name: 'JSESSIONID',
            value: sessionId,
            path: '/',
            domain: API_HOST,
        });
    }

    if (Platform.OS === 'android' && CookieManager.flush) {
        await CookieManager.flush();
    }
};

export const commitSession = (sessionId: string): void => {
    setMemorySessionId(sessionId);
};

const readSessionIdFromCookieJar = async (): Promise<string | null> => {
    const cookies = await CookieManager.get(API_BASE_URL);
    return cookies?.JSESSIONID?.value ?? null;
};

const resolveSessionId = async (
    setCookieHeader?: string,
    maxAttempts = 20,
): Promise<string | null> => {
    const fromHeader = parseJSessionId(setCookieHeader);
    if (fromHeader) {
        commitSession(fromHeader);
        await persistSessionCookie(fromHeader, setCookieHeader);
        return fromHeader;
    }

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const fromJar = await readSessionIdFromCookieJar();
        if (fromJar) {
            commitSession(fromJar);
            await persistSessionCookie(fromJar, setCookieHeader);
            return fromJar;
        }
        await sleep(50);
    }

    return getMemorySessionId();
};

export const ensureSessionReady = async (): Promise<boolean> => {
    if (getMemorySessionId()) {
        return true;
    }

    const sessionId = await resolveSessionId(undefined, 10);
    return sessionId !== null;
};

export const requireSessionReady = async (): Promise<void> => {
    const ready = await ensureSessionReady();
    if (!ready) {
        throw new SessionNotReadyError();
    }
};

export const saveSessionFromResponse = async (response: AxiosResponse): Promise<boolean> => {
    const setCookieHeader = extractSetCookieHeader(response);
    const sessionId = await resolveSessionId(setCookieHeader);
    return sessionId !== null;
};

export const saveSessionFromFetchResponse = async (response: Response): Promise<boolean> => {
    const setCookieHeader = extractSetCookieHeader(response);
    const sessionId = await resolveSessionId(setCookieHeader);
    return sessionId !== null;
};

export const clearSession = async (): Promise<void> => {
    setMemorySessionId(null);
    if (CookieManager.clearAll) {
        await CookieManager.clearAll();
    }
};

export const getJSessionId = async (): Promise<string | null> => {
    if (getMemorySessionId()) {
        return getMemorySessionId();
    }

    const sessionId = await readSessionIdFromCookieJar();
    if (sessionId) {
        commitSession(sessionId);
    }

    return sessionId;
};

export const getSessionHeaders = async (): Promise<Record<string, string>> => {
    await ensureSessionReady();
    const jsessionid = getMemorySessionId() ?? (await getJSessionId());
    return jsessionid ? { Cookie: `JSESSIONID=${jsessionid}` } : {};
};

api.interceptors.request.use(async (config) => {
    const isLoginRequest = config.url?.includes('/member/login');

    if (!isLoginRequest) {
        const jsessionid = getMemorySessionId() ?? (await getJSessionId());
        if (jsessionid) {
            applyRequestHeader(config, 'Cookie', `JSESSIONID=${jsessionid}`);
        }
    }

    return config;
});

api.interceptors.response.use(
    async (response) => {
        if (response.config.url?.includes('/member/login')) {
            await saveSessionFromResponse(response);
        }
        return response;
    },
    async (error) => {
        if (error.response?.config?.url?.includes('/member/login')) {
            await saveSessionFromResponse(error.response);
        }
        return Promise.reject(error);
    },
);
