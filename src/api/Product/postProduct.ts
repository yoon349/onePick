import { api } from '../axios';

// 요청 body 타입
export interface CreateProductRequest {
    title: string;
    content: string;
    price: number;
    minPeople: number;
    deadlineDays: number;
    category: string;
    productId?: number;
}

// POST API
export const postProduct = async (body: CreateProductRequest) => {
    const response = await api.post(
        `/api/v1/product`,
        body,
    );

    return response.data;
};

// 펀딩 모집 글 작성