import axios from 'axios';
import { BFF_BASE_URL } from '../constants/appConfig';
import { BffSuccessResponse, BffErrorResponse } from '../types/sharedTypes';

/**
 * Configured Axios instance for all BFF communication.
 * Response interceptor unwraps the BFF success envelope automatically;
 * error interceptor extracts the user-facing message from the BFF error envelope.
 */
export const apiClient = axios.create({
  baseURL: BFF_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

apiClient.interceptors.response.use(
  (response) => {
    const envelope = response.data as BffSuccessResponse<unknown>;
    response.data = envelope.data;
    return response;
  },
  (error) => {
    const envelope = error.response?.data as BffErrorResponse | undefined;
    const userMessage =
      envelope?.error?.message ??
      'An unexpected error occurred; please try again.';
    return Promise.reject(new Error(userMessage));
  },
);
