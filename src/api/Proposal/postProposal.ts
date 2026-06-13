import { API_BASE_URL, getSessionHeaders } from '../axios';

import { TextEncoder } from 'text-encoding';
import { decode } from 'base-64';



// 요청 body 타입
export interface CreatePostRequest {
    title: string;
    content: string;
    category: string;
    maxPrice: number;
    deadlineDays: number;
    imageMetas: any[];
}


// base64 문자열 → Uint8Array 변환
const base64ToUint8Array = (base64: string): Uint8Array => {
    const binaryString = decode(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};


// POST API
export const postProposal = async (body: CreatePostRequest) => {

    const hasImages = body.imageMetas && body.imageMetas.length > 0;
    const sessionHeaders = await getSessionHeaders();

    if (!hasImages) {
        const response = await fetch(`${API_BASE_URL}/api/v1/proposals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...sessionHeaders,
            },
            body: JSON.stringify({
                title:        body.title,
                content:      body.content,
                category:     body.category,
                maxPrice:     body.maxPrice,
                deadlineDays: body.deadlineDays,
                imageMetas:   [],
            }),
        });
        return response.json();
    }

    const boundary = `----FormBoundary${Date.now()}`;

    const dataPayload = {
        title:        body.title,
        content:      body.content,
        category:     body.category,
        maxPrice:     body.maxPrice,
        deadlineDays: body.deadlineDays,
        imageMetas:   body.imageMetas.map((img, index) => ({
            sourceType:   img.isSketch ? 'AI'  : 'REAL',
            aiGenerated:  img.isSketch ? true  : false,
            ...(img.isSketch && img.prompt ? { prompt: img.prompt } : {}),
            displayOrder: index,
        })),
    };

    const image     = body.imageMetas[0];
    const imageName = image.name ?? 'photo.jpg';
    const imageType = image.type ?? 'image/jpeg';

    // ✅ 스케치(base64)와 일반 이미지(file://) 구분해서 처리
    let imageBytes: Uint8Array;

    if (image.isSketch && image.uri.startsWith('data:')) {
        // 스케치 — base64에서 바이너리 변환
        const base64Data = image.uri.replace(/^data:image\/\w+;base64,/, '');
        imageBytes = base64ToUint8Array(base64Data);
    } else {
        // 일반 이미지 — file:// URI에서 읽기
        const imageResponse = await fetch(image.uri);
        const imageBuffer   = await imageResponse.arrayBuffer();
        imageBytes          = new Uint8Array(imageBuffer);
    }

    const encoder = new TextEncoder();

    const dataPart = encoder.encode(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="data"; filename="data.json"\r\n` +
        `Content-Type: application/json\r\n\r\n` +
        `${JSON.stringify(dataPayload)}\r\n`
    );

    const imageHeader = encoder.encode(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="images"; filename="${imageName}"\r\n` +
        `Content-Type: ${imageType}\r\n\r\n`
    );

    const closing = encoder.encode(`\r\n--${boundary}--\r\n`);

    const total    = dataPart.length + imageHeader.length + imageBytes.length + closing.length;
    const combined = new Uint8Array(total);
    let offset = 0;
    combined.set(dataPart,    offset); offset += dataPart.length;
    combined.set(imageHeader, offset); offset += imageHeader.length;
    combined.set(imageBytes,  offset); offset += imageBytes.length;
    combined.set(closing,     offset);

    const response = await fetch(`${API_BASE_URL}/api/v1/proposals`, {
        method: 'POST',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            ...sessionHeaders,
        },
        body: combined.buffer,
    });

    const result = await response.json();
    console.log('서버 응답:', JSON.stringify(result));
    return result;
};


// 구매 요청 글 작성