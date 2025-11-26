import axios from 'axios';

const API_BASE = '/api';
const CLOUDFRONT_BASE = import.meta.env.VITE_CLOUDFRONT_URL;


export const getUploadUrl = async () => {
    try {
        const response = await axios.post(`${API_BASE}/upload-url`);
        // The body is a stringified JSON
        const body = typeof response.data.body === 'string' ? JSON.parse(response.data.body) : response.data.body;
        return body;
    } catch (error) {
        console.error('Error getting upload URL:', error);
        throw error;
    }
};

export const uploadFileToS3 = async (uploadUrl, file) => {
    try {
        await axios.put(uploadUrl, file, {
            headers: {
                'Content-Type': file.type,
            },
        });
    } catch (error) {
        console.error('Error uploading file to S3:', error);
        throw error;
    }
};

export const saveMessage = async (fileUrl) => {
    try {
        // Extract filename from fileUrl and construct CloudFront URL
        const filename = fileUrl.split('/').pop();
        const cloudfrontUrl = `${CLOUDFRONT_BASE}/${filename}`;

        const payload = {
            message: 'log',
            imageUrl: cloudfrontUrl,
        };

        await axios.post(`${API_BASE}/messages`, payload);
        return cloudfrontUrl;
    } catch (error) {
        console.error('Error saving message:', error);
        throw error;
    }
};

export const getMessages = async () => {
    try {
        const response = await axios.get(`${API_BASE}/messages`);
        const body = typeof response.data.body === 'string'
            ? JSON.parse(response.data.body)
            : response.data.body;

        return body
            // Filter: chỉ giữ imageUrl bắt đầu bằng CloudFront
            .filter(item => {
                const url = item.imageUrl?.S;
                return url && url.startsWith(CLOUDFRONT_BASE);
            })

            // Map DynamoDB → object đơn giản
            .map(item => ({
                createdAt: item.createdAt?.S,
                message: item.message?.S,
                imageUrl: item.imageUrl?.S,
                id: item['Nvluong136@']?.S
            }))

            // Sort theo createdAt mới nhất
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    } catch (error) {
        console.error('Error getting messages:', error);
        throw error;
    }
};
