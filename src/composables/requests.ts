// 文件 utils/axios.ts
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import type { ConfigProviderProps } from 'naive-ui'
import {
  createDiscreteApi,
  darkTheme,
  lightTheme,
} from 'naive-ui'
import type { Response } from '~/types'

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
    this.baseUrl = 'http://localhost:4001/'
    if (import.meta.env.MODE === 'production')
      this.baseUrl = 'https://api.dvaren.top/admin'
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
    instance.interceptors.request.use((config) => {
      // 添加全局的loading..
      // 请求头携带token
      const token = localStorage.getItem('token')
      if (token)
        config.headers!.token = token
      return config
    }, (error: any) => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use((res) => {
      // 返回数据
      const { data } = res
      if (data?.code === 405) {
        // message.error(data?.msg)
        message.error('登录失效啦')
        localStorage.removeItem('token')
        return Promise.reject(data)
      }
      if (data?.code !== 200) {
        // message.error(data?.msg)
        message.error(data?.msg)
        // return Promise.reject(data)
        return data
      }
      if (data.code === 5000) {
        localStorage.removeItem('token')
        return
      }
      return data
    }, (error: any) => {
      message.error('服务器错误')
      return Promise.reject(error)
    })
  }

  request(options: AxiosRequestConfig) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options) as unknown as Promise<Response<any>>
  }
}

const http = new HttpRequest()
export default http
