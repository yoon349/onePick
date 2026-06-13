let memorySessionId: string | null = null;

export const getMemorySessionId = (): string | null => memorySessionId;

export const setMemorySessionId = (sessionId: string | null): void => {
    memorySessionId = sessionId;
};

export const parseJSessionId = (setCookieHeader: string | undefined): string | null => {
    if (!setCookieHeader) {
        return null;
    }

    return setCookieHeader.match(/JSESSIONID=([^;,\s]+)/i)?.[1] ?? null;
};

export const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
