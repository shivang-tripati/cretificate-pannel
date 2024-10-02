import axios from 'axios';

const API_BASE_URL = 'https://cretificate-pannel-production.up.railway.app/';

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Ensure cookies are sent with requests
});

// Authentication API calls
export const login = async (email: string, password: string):Promise<{data: any, status: number}> => {
    try {
        const response = await api.post('api/auth/login', { email, password });
        console.log("login response", response.data);
        return {
            data: response.data,
            status: response.status};
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Login failed:', error.response.data);
        } else {
            console.error('An unexpected error occurred during login:', error);
        }
        throw error;  // Ensure the error is thrown so it's handled at a higher level
    }
};

export const register = async (email: string, password: string) => {
    try {
        const response = await api.post('api/auth/register', { email, password });
        return response;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Server responded with status:', error.response.status);
            console.error('Response data:', error.response.data);
        } else {
            console.error('An unexpected error occurred during registration:', error);
        }
        throw error;
    }
};

export const logout = async (device: string) => {
    try {
        let response;
        if (device === "current") {
            response = await api.post('api/auth/logout');
        } else if (device === "all") {
            response = await api.post('api/auth/logout-all');
        }
        return response;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Logout failed:', error.response.data);
        } else {
            console.error('An unexpected error occurred during logout:', error);
        }
        throw error;
    }
};

// Certificate API calls
export const getCertificates = async () => {
    try {
        const response = await api.get('api/certificates');
        return response;
    } catch (error) {
        console.error('An error occurred fetching certificates:', error);
        throw error;
    }
};

export const getCertificateById = async (id: string) => {
    try {
        const response = await api.get(`api/certificates/${id}`);
        return response;
    } catch (error) {
        console.error(`An error occurred fetching certificate with ID ${id}:`, error);
        throw error;
    }
};

export const createCertificate = async (data: FormData) => {
    try {
        const response = await api.post('api/certificates/create', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Server responded with status:', error.response.status);
            console.error('Response data:', error.response.data);
        } else {
            console.error('An unexpected error occurred during certificate creation:', error);
        }
        throw error;
    }
};

export const updateCertificate = async (id: string, data: FormData) => {
    try {
        const response = await api.put(`api/certificates/${id}`, data);
        return response;
    } catch (error) {
        console.error(`An error occurred updating certificate with ID ${id}:`, error);
        throw error;
    }
};

export const updateCertificateStatus = async (id: string, status: string) => {
    try {
        const response = await api.put(`api/certificates/${id}`, { status });
        return response;
    } catch (error) {
        console.error(`An error occurred updating certificate status with ID ${id}:`, error);
        throw error;
    }
};

export const deleteCertificate = async (id: string) => {
    try {
        const response = await api.delete(`api/certificates/${id}`);
        return response;
    } catch (error) {
        console.error(`An error occurred deleting certificate with ID ${id}:`, error);
        throw error;
    }
};
