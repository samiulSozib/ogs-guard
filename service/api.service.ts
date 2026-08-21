// import { ApiResponse, LoginCredentials, LoginResponse, User } from '@/app/types/api.types';
// import axios, { AxiosError, AxiosResponse } from 'axios';

// // const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
// const API_BASE_URL = 'https://ogs.api.v1.1guardsecurity.com/api/v1';


// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// const loginapi = axios.create({
//   baseURL: "https://ogs.api.v1.1guardsecurity.com/api/v1",
//   //baseURL: "http://127.0.0.1:8000/api/v1",
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor to handle common errors
// api.interceptors.response.use(
//   (response: AxiosResponse<ApiResponse<unknown>>) => {
//     // You can add common success handling here
//     return response;
//   },
//   (error: AxiosError<{ errors: { message?: string }, message?: string }>) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized access
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       //window.location.href = '/auth/login';
//     }
//     console.log(error)
//     const errorMessage = error.response?.data?.errors?.message || error.message || 'An error occurred';
//     return Promise.reject(errorMessage);
//   }
// );

// // Generic API response handler
// export const handleApiResponse = async <T>(
//   promise: Promise<AxiosResponse<ApiResponse<T>>>
// ): Promise<T> => {
//   try {
//     const response = await promise;
//     console.log(!response.data.success)
//     if (!response.data.success) {

//       throw new Error(response.data.message || 'Request failed');
//     }

//     return response.data.body;
//   } catch (error) {
//     if (typeof error === 'string') {
//       throw new Error(error);
//     }
//     throw error;
//   }
// };

// // Auth Service
// export const authService = {
//   login: (credentials: LoginCredentials) =>
//     handleApiResponse(
//       loginapi.post<ApiResponse<LoginResponse>>('/guardemployee/auth/login', credentials)
//     ),

//   logout: () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   },

//   getProfile: () =>
//     handleApiResponse(api.get<ApiResponse<User>>('/profile')),
// };



// export default api;

// service/api.service.ts
import { ApiResponse, LoginCredentials, LoginResponse, User } from '@/app/types/api.types';
import axios, { AxiosError, AxiosResponse } from 'axios';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
const API_BASE_URL = 'https://ogs.api.v1.1guardsecurity.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const loginapi = axios.create({
  baseURL: "https://ogs.api.v1.1guardsecurity.com/api/v1",
  //baseURL: "http://127.0.0.1:8000/api/v1",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token (supports both guard and client)
api.interceptors.request.use(
  (config) => {
    // Check user type to determine which token to use
    const userType = localStorage.getItem('user_type');
    let token = null;
    
    if (userType === 'client') {
      token = localStorage.getItem('client_token');
    } else {
      // Default to guard token
      token = localStorage.getItem('token');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    return response;
  },
  (error: AxiosError<{ errors: { message?: string }, message?: string }>) => {
    const status = error.response?.status;
    const userType = localStorage.getItem('user_type');
    
    if (status === 401) {
      // Handle unauthorized access based on user type
      if (userType === 'client') {
        localStorage.removeItem('client_token');
        localStorage.removeItem('client_user');
        localStorage.removeItem('user_type');
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      // Only redirect if not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
        window.location.href = '/auth/login';
      }
    }
    
    console.log('API Error:', error);
    const errorMessage = error.response?.data?.errors?.message || 
                        error.response?.data?.message || 
                        error.message || 
                        'An error occurred';
    return Promise.reject(errorMessage);
  }
);

// Generic API response handler
export const handleApiResponse = async <T>(
  promise: Promise<AxiosResponse<ApiResponse<T>>>
): Promise<T> => {
  try {
    const response = await promise;
    if (!response.data.success) {
      throw new Error(response.data.message || 'Request failed');
    }
    return response.data.body;
  } catch (error) {
    if (typeof error === 'string') {
      throw new Error(error);
    }
    throw error;
  }
};

// Auth Service (Guard)
export const authService = {
  login: (credentials: LoginCredentials) =>
    handleApiResponse(
      loginapi.post<ApiResponse<LoginResponse>>('/guardemployee/auth/login', credentials)
    ),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_type');
  },

  getProfile: () =>
    handleApiResponse(api.get<ApiResponse<User>>('/profile')),
};

export default api;