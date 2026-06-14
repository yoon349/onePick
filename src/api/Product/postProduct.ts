import { api, requireSessionReady } from '../axios';

// 요청 body 타입
export interface CreatePostRequest {
    title: string;
    content: string;
    price: number;
    minQuantity: number,
    deadlineDays: number,
    category: string,
    imageMetas: any[];
}

type ProductPayload = {
    title: string;
    content: string;
    price: number;
    minQuantity: number,
    deadlineDays: number,
    category: string,
    imageMetas: Array<{
    }>;
};

const buildPayload = (body: CreatePostRequest): ProductPayload => ({
    title: body.title,
    content: body.content,
    price: body.price,
    minQuantity: body.minQuantity,
    deadlineDays: body.deadlineDays,
    category: body.category,
    imageMetas: body.imageMetas.map((img, index) => ({
    })),
});

const appendJsonPart = (formData: FormData, payload: ProductPayload): void => {
    formData.append('data', {
        string: JSON.stringify(payload),
        type: 'application/json',
        name: 'data.json',
    } as unknown as Blob);
};

const appendImagePart = (formData: FormData, image: any): void => {
    const imageName = image.name ?? 'photo.jpg';
    const imageType = image.type ?? 'image/jpeg';

    formData.append('images', {
        uri: image.uri,
        name: imageName,
        type: imageType,
    } as unknown as Blob);
};

// POST API — axios 사용 (RN fetch는 Cookie 헤더가 무시될 수 있음)
export const postProduct = async (body: CreatePostRequest) => {
    await requireSessionReady();

    const hasImages = body.imageMetas && body.imageMetas.length > 0;

    if (!hasImages) {
        const response = await api.post('/api/v1/product', {
            title: body.title,
            content: body.content,
            price: body.price,
            minQuantity: body.minQuantity,
            deadlineDays: body.deadlineDays,
            category: body.category
            imageMetas: [],
        });
        return response.data;
    }

    const formData = new FormData();
    appendJsonPart(formData, buildPayload(body));
    appendImagePart(formData, body.imageMetas[0]);

    const response = await api.post('/api/v1/product', formData, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

// 펀딩 모집 글 작성