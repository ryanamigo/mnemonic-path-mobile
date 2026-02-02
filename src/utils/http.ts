import ky, { type Options } from 'ky'

type Pagination = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  isLastPage: boolean;
};

type Response<T> = {
  success: boolean;
  data?: T;
  pagination?: Pagination;
};

function request<T = any>(url: string, options?: Options) {
  const token = localStorage.getItem('token')
  return ky<Response<T>>(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `${token}`,
    },
    prefixUrl: import.meta.env.VITE_APP_API_URL,
    timeout: false
    // prefixUrl: 'https://mnemonic-api.age63.work/',
  })
}

function get<T = any>(url: string, options?: Options) {
  return request<T>(url, {
    method: 'GET',
    ...options,
  })
}

function post<T = any>(url: string, options?: Options) {
  return request<T>(url, {
    method: 'POST',
    ...options,
  })
}

function put<T = any>(url: string, options?: Options) {
  return request<T>(url, {
    method: 'PUT',
    ...options,
  })
}

function del<T = any>(url: string, options?: Options) {
  return request<T>(url, {
    method: 'DELETE',
    ...options,
  })
}

const http = { get, post, put, del }

export default http