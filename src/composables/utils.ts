import images from './images.json'
import type { IP } from '~/types'

export const emptyValue = (s: string | undefined) => {
  return s || '-'
}

export const ipLocationCacheMap = new Map<string, IP>()

export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}

export function randomImageUrl() {
  return images.ai[randomNumber(0, images.ai.length)]
}

export function joinUrl(baseUrl: string, relativeUrl: string) {
  if (!baseUrl || !relativeUrl)
    return ''
  return `${baseUrl.replace(/\/$/, '')}/${relativeUrl.replace(/^\//, '')}`
}
