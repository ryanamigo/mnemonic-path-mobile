import http from "@/utils/http";
import { ref, watch } from "vue";

type PaginationParams = {
  page: number
  pageSize: number
  [key: string]: any
}

function useInfinity<T = any>(url: string, params?: PaginationParams) {
  const page = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const totalPages = ref(0)
  const isLastPage = ref(false)
  const loading = ref(false)
  const data = ref<T[]>([])

  async function fetchData(p?: PaginationParams, append: boolean = false) {
    if (loading.value && append) return

    loading.value = true
    try {
      const res = await http.get<T[]>(url, {
        searchParams: {
          page: p?.page || page.value,
          pageSize: p?.pageSize || pageSize.value,
          ...params,
        }
      }).json()

      const newData = res.data || []

      if (append) {
        data.value = [...data.value, ...newData] as T[]
      } else {
        data.value = newData
      }

      total.value = res.pagination?.total || 0
      totalPages.value = res.pagination?.totalPages || 0
      isLastPage.value = res.pagination?.isLastPage || false
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  watch([page, pageSize, () => params], ([newPage, newPageSize, newParams]) => {
    if (newPage === 1) {
      fetchData({ page: newPage, pageSize: newPageSize, ...newParams }, false)
    } else {
      fetchData({ page: newPage, pageSize: newPageSize, ...newParams }, true)
    }
  }, { immediate: true })

  const loadMore = () => {
    if (!isLastPage.value && !loading.value) {
      page.value += 1
    }
  }

  const reset = () => {
    page.value = 1
  }

  return {
    page,
    pageSize,
    total,
    totalPages,
    isLastPage,
    loading,
    data,
    loadMore,
    reset,
    fetchData,
  }
}

export default useInfinity
