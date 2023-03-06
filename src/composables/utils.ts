import type { IP } from '~/types'
import images from './images.json'

export const emptyValue = (s: string | undefined) => {
  return s || '-'
}

export const ipLocationCacheMap = new Map<string, IP>()

export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}

export function randomImageUrl() {
  return images[randomNumber(0,images.length)]
}