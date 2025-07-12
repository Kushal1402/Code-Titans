import axios from './axios';

export const api = {
    get: async (url: string | [string, Record<string, string | number>]) => {
        const apitString = Array.isArray(url) ? url[0] : url;
        const params = Array.isArray(url) && url.length == 2 ? url[1] : {};
        const response = await axios.get(apitString, { params });
        return response.data;
    },
    put: async <T>(url: string, data: T) => {
        const response = await axios.put(url, data);
        return response.data;
    },
    post: async <T>(url: string, data: T) => {
        const response = await axios.post(url, data);
        return response.data;
    },
    delete: async (url: string) => {
        const response = await axios.delete(url);
        return response.data;
    },
};

export const isAxiosError = (
    error: unknown
): error is { response: { data: { message: string } } } => {
    return typeof error === 'object' && error !== null && 'response' in error;
};
