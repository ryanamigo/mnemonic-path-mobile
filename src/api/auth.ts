import http from "@/utils/http"

export const login = (params: { password: string }) => {
  return http.post<{ token: string }>('api/auth/login', { json: params }).json()
}