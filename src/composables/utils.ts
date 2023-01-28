import type { IP } from '~/types'

export const emptyValue = (s: string | undefined) => {
  return s || '-'
}

export const ipLocationCacheMap = new Map<string, IP>()
