export function useAsyncData<T>(fetchData: () => Promise<T>) {
  const data = ref<T | null>(null)
  const loading = ref<boolean>(true)
  const error = ref<any>(null)

  const refresh = async () => {
    try {
      data.value = await fetchData()
    }
    catch (e) {
      error.value = e
    }
    finally {
      loading.value = false
    }
  }

  // 在创建时自动加载数据
  refresh()

  return { data, loading, error, refresh }
}
