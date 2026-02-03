import type { CreateMnemonicParams } from "@/types/mnemonic"
import http from "@/utils/http"

export const getPresigndUrl = (params: { fileName: string }) => {
  return http.get<{ url: string }>('api/bucket/presign', { searchParams: params }).json()
}

export const createMnemonic = (params: CreateMnemonicParams) => {
  return http.post('api/mnemonics', { json: params }).json()
}

export const deleteMnemonic = (id: string) => {
  return http.del(`api/mnemonics/${id}`).json()
}