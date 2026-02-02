import type { CreateMnemonicParams } from "@/types/mnemonic"
import http from "@/utils/http"

export const getPresigndUrl = (params: { fileName: string }) => {
  return http.get<{ url: string }>('api/bucket/presign', { searchParams: params }).json()
}

export const createMnemonic = (params: CreateMnemonicParams) => {
  return http.post('api/mnemonics', { json: params }).json()
}