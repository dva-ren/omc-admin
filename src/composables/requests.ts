// 文件 utils/axios.ts
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import type { ConfigProviderProps } from 'naive-ui'
import {
  createDiscreteApi,
  darkTheme,
  lightTheme,
} from 'naive-ui'
import { ACCESS_TOKEN } from '~/constants/system'

const themeRef = ref<'light' | 'dark'>('light')
const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
  theme: themeRef.value === 'light' ? lightTheme : darkTheme,
}))

const { message } = createDiscreteApi(
  ['message'],
  {
    configProviderProps: configProviderPropsRef,
  },
)

class HttpRequest {
  private readonly baseUrl: string
  constructor() {
    this.baseUrl = 'http://localhost:2333/'
    if (import.meta.env.MODE === 'production')
      this.baseUrl = 'https://api.dvaren.xyz/admin'
  }

  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      },
    }
    return config
  }

  // 请求拦截
  interceptors(instance: AxiosInstance, url: string | number | undefined) {
    instance.interceptors.request.use((config: any) => {
      // 添加全局的loading..
      // 请求头携带token
      const token = localStorage.getItem(ACCESS_TOKEN)
      if (token)
        config.headers[ACCESS_TOKEN] = token
      return config
    }, (error: any) => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use((res) => {
      // 返回数据
      return res.data
    }, (error: any) => {
      if (error.response.status === 400) {
        message.error(error.response.data.message)
      }
      else if (error.response.status === 422) {
        message.error(error.response.data.message[0])
      }
      else if (error.response.status === 401) {
        message.error(error.response.data.message)
        if (location.pathname !== '/init' && location.pathname !== '/login') {
          setTimeout(() => {
            location.href = '/login'
            localStorage.removeItem(ACCESS_TOKEN)
          }, 2000)
        }
      }
      else { message.error('服务器错误') }
      return Promise.reject(error)
    })
  }

  request<T>(options: AxiosRequestConfig) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options) as unknown as Promise<T>
  }
}

const http = new HttpRequest()
export default http
