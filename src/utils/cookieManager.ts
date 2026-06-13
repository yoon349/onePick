import { Platform } from 'react-native';

type CookieRecord = { value: string };
type CookieMap = Record<string, CookieRecord>;

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

const webCookieManager = {
    getAll: async (): Promise<CookieMap> => parseDocumentCookies(),
    get: async (_url: string): Promise<CookieMap> => parseDocumentCookies(),
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
};

const CookieManager =
    Platform.OS === 'web'
        ? webCookieManager
        : require('@react-native-cookies/cookies').default;

export default CookieManager;
