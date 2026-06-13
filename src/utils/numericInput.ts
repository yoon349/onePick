export const filterDigitsOnly = (text: string): string => text.replace(/[^0-9]/g, '');

export const parsePositiveInt = (value: string): number | null => {
    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }

    const num = Number(trimmed);
    if (!Number.isInteger(num) || num <= 0) {
        return null;
    }

    return num;
};
