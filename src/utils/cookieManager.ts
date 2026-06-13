import { Platform } from 'react-native';

type CookieRecord = { value: string };
type CookieMap = Record<string, CookieRecord>;

type NativeCookieInput = {
    name: string;
    value: string;
    path?: string;
    domain?: string;
};

type CookieManagerLike = {
    getAll: () => Promise<CookieMap>;
    get: (url: string) => Promise<CookieMap>;
    set?: (url: string, cookie: NativeCookieInput) => Promise<boolean>;
    setFromResponse: (url: string, header: string) => Promise<boolean>;
    clearAll?: () => Promise<boolean>;
    flush?: () => Promise<void>;
};

const getDocument = (): { cookie: string } | undefined => {
    if (typeof globalThis === 'undefined' || !('document' in globalThis)) {
        return undefined;
    }

    return (globalThis as { document?: { cookie: string } }).document;
};

const parseDocumentCookies = (): CookieMap => {
    const documentRef = getDocument();
    if (!documentRef) {
        return {};
    }

    return documentRef.cookie.split(';').reduce<CookieMap>((cookies: CookieMap, part: string) => {
        const trimmed = part.trim();
        if (!trimmed) {
            return cookies;
        }

        const separatorIndex = trimmed.indexOf('=');
        if (separatorIndex === -1) {
            return cookies;
        }

        const name = trimmed.slice(0, separatorIndex);
        const value = decodeURIComponent(trimmed.slice(separatorIndex + 1));
        cookies[name] = { value };
        return cookies;
    }, {});
};

const webCookieManager: CookieManagerLike = {
    getAll: async (): Promise<CookieMap> => parseDocumentCookies(),
    get: async (_url: string): Promise<CookieMap> => parseDocumentCookies(),
    set: async (_url: string, cookie: NativeCookieInput): Promise<boolean> => {
        const documentRef = getDocument();
        if (!documentRef) {
            return false;
        }

        documentRef.cookie = `${cookie.name}=${encodeURIComponent(cookie.value)}; path=${cookie.path ?? '/'}`;
        return true;
    },
    setFromResponse: async (_url: string, header: string): Promise<boolean> => {
        const documentRef = getDocument();
        if (!documentRef) {
            return false;
        }

        const cookiePart = header.split(';')[0]?.trim();
        if (!cookiePart) {
            return false;
        }

        documentRef.cookie = `${cookiePart}; path=/`;
        return true;
    },
    clearAll: async (): Promise<boolean> => {
        const documentRef = getDocument();
        if (!documentRef) {
            return false;
        }

        documentRef.cookie.split(';').forEach((part) => {
            const name = part.split('=')[0]?.trim();
            if (name) {
                documentRef.cookie = `${name}=; Max-Age=0; path=/`;
            }
        });
        return true;
    },
};

const nativeCookieManager = require('@react-native-cookies/cookies') as CookieManagerLike;

const CookieManager: CookieManagerLike =
    Platform.OS === 'web'
        ? webCookieManager
        : nativeCookieManager;

export default CookieManager;
