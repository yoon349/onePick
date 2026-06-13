export interface CommonResponse<T> {
    success: boolean;
    data: T | null;
    code: string | null;
    message: string | null;
}
