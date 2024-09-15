import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_BASE_URL ||'http://localhost:3000'

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
});
axiosInstance.interceptors.response.use(async function (response) {
    return response;
}, function (error) {
    if(error.response){
        console.log('errorr server: ' , error.response.data)
    }
    return Promise.reject(error);
});
