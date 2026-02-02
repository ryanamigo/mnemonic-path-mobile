import http from "@/utils/http";
import { ref, watch } from "vue";

type PaginationParams = {
  page: number
  pageSize: number
  [key: string]: any
}

function usePagination<T = any>(url: string, params?: PaginationParams) {
  const page = ref(1)
  const pageSize = ref(2)
  const total = ref(0)
  const totalPages = ref(0)
  const isLastPage = ref(false)
  const data = ref<T[]>([])

  async function fetchData(p?: PaginationParams) {
    const res = await http.get<T[]>(url, {
      searchParams: {
        page: p?.page || page.value,
        pageSize: p?.pageSize || pageSize.value,
        ...params,
      }
    }).json()
    data.value = res.data || []
    total.value = res.pagination?.total || 0
    totalPages.value = res.pagination?.totalPages || 0
    isLastPage.value = res.pagination?.isLastPage || false
  }

  watch([page, pageSize, () => params], ([newPage, newPageSize, newParams]) => {
    fetchData({ page: newPage, pageSize: newPageSize, ...(newParams) })
  }, { immediate: true })


  return {
    page,
    pageSize,
    total,
    totalPages,
    isLastPage,
    data,
    fetchData,
  }
}

export default usePagination