import { api, requireSessionReady } from '../axios';

// 요청 body 타입
export interface CreatePostRequest {
    title: string;
    content: string;
    category: string;
    maxPrice: number;
    deadlineDays: number;
    imageMetas: any[];
}

type ProposalPayload = {
    title: string;
    content: string;
    category: string;
    maxPrice: number;
    deadlineDays: number;
    imageMetas: Array<{
        sourceType: 'AI' | 'REAL';
        aiGenerated: boolean;
        prompt?: string;
        displayOrder: number;
    }>;
};

const buildPayload = (body: CreatePostRequest): ProposalPayload => ({
    title:        body.title,
    content:      body.content,
    category:     body.category,
    maxPrice:     body.maxPrice,
    deadlineDays: body.deadlineDays,
    imageMetas:   body.imageMetas.map((img, index) => ({
        sourceType:   img.isSketch ? 'AI' : 'REAL',
        aiGenerated:  img.isSketch ? true : false,
        ...(img.isSketch && img.prompt ? { prompt: img.prompt } : {}),
        displayOrder: index,
    })),
});

const appendJsonPart = (formData: FormData, payload: ProposalPayload): void => {
    formData.append('data', {
        string: JSON.stringify(payload),
        type: 'application/json',
        name: 'data.json',
    } as unknown as Blob);
};

const appendImagePart = (formData: FormData, image: any): void => {
    const imageName = image.name ?? 'photo.jpg';
    const imageType = image.type ?? 'image/jpeg';

    if (image.isSketch && image.uri.startsWith('data:')) {
        formData.append('images', {
            uri:  image.uri,
            name: imageName,
            type: imageType,
        } as unknown as Blob);
        return;
    }

    formData.append('images', {
        uri:  image.uri,
        name: imageName,
        type: imageType,
    } as unknown as Blob);
};

// POST API — axios 사용 (RN fetch는 Cookie 헤더가 무시될 수 있음)
export const postProposal = async (body: CreatePostRequest) => {
    await requireSessionReady();

    const hasImages = body.imageMetas && body.imageMetas.length > 0;

    if (!hasImages) {
        const response = await api.post('/api/v1/proposals', {
            title:        body.title,
            content:      body.content,
            category:     body.category,
            maxPrice:     body.maxPrice,
            deadlineDays: body.deadlineDays,
            imageMetas:   [],
        });
        return response.data;
    }

    const formData = new FormData();
    appendJsonPart(formData, buildPayload(body));
    appendImagePart(formData, body.imageMetas[0]);

    const response = await api.post('/api/v1/proposals', formData, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

// 구매 요청 글 작성
