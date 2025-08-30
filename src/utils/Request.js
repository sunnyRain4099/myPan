import axios from 'axios'

import { ElLoading } from 'element-plus'
import router from '@/router'

import Message from '../utils/Message'

const contentTypeForm = 'application/x-www-form-urlencoded;charset=UTF-8'
const contentTypeJson = 'application/json'
//arraybuffer	ArrayBuffer对象
//blob	Blob对象
const responseTypeJson = 'json'

let loading = null
const instance = axios.create({
  baseURL: '/api',
  timeout: 30 * 1000
})
//请求前拦截器
instance.interceptors.request.use(
  (config) => {
    if (config.showLoading) {
      loading = ElLoading.service({
        lock: true,
        text: '加载中......',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
    return config
  },
  (error) => {
    if (config.showLoading && loading) {
      loading.close()
    }
    Message.error('请求发送失败')
    return Promise.reject('请求发送失败')
  }
)
//请求后拦截器
instance.interceptors.response.use(
  (response) => {
    const {
      showLoading,
      errorCallback,
      showError = true,
      responseType
    } = response.config
    if (showLoading && loading) {
      loading.close()
    }
    const responseData = response.data
    if (responseType == 'arraybuffer' || responseType == 'blob') {
      return responseData
    }
    //正常请求
    if (responseData.code == 200) {
      return responseData
    } else if (responseData.code == 401) {
      //登录超时
      router.push(
        '/login?redirectUrl=' + encodeURI(router.currentRoute.value.path)
      )
      return Promise.reject({ showError: false, msg: '登录超时' })
    } else {
      //其他错误
      if (errorCallback) {
        errorCallback(responseData.info)
      }
      return Promise.reject({ showError: showError, msg: responseData.info })
    }
  },
  (error) => {
    if (error.config.showLoading && loading) {
      loading.close()
    }
    return Promise.reject({ showError: true, msg: '网络异常' })
  }
)

// 定义一个请求函数，接收一个配置对象作为参数
const request = (config) => {
  // 从配置对象中解构出各个参数
  const {
    url, // 请求的URL
    params, // 请求的参数
    dataType, // 数据类型
    showLoading = true, // 是否显示加载动画，默认为true
    responseType = responseTypeJson // 响应类型，默认为JSON
  } = config
  // 设置默认的Content-Type为表单数据
  let contentType = contentTypeForm
  // 创建一个FormData对象，用于存储请求参数
  let formData = new FormData() // 创建form对象
  // 遍历参数对象，将参数添加到FormData中
  for (let key in params) {
    formData.append(key, params[key] == undefined ? '' : params[key])
  }
  // 如果数据类型为JSON，则设置Content-Type为JSON
  if (dataType != null && dataType == 'json') {
    contentType = contentTypeJson
  }
  // 设置请求头
  let headers = {
    'Content-Type': contentType, // 设置Content-Type
    'X-Requested-With': 'XMLHttpRequest' // 设置请求类型为XMLHttpRequest
  }

  // 返回一个Promise对象，使用axios的post方法发送请求
  return instance
    .post(url, formData, {
      onUploadProgress: (event) => {
        // 如果配置中存在上传进度回调函数，则调用
        if (config.uploadProgressCallback) {
          config.uploadProgressCallback(event)
        }
      },
      responseType: responseType, // 设置响应类型
      headers: headers, // 设置请求头
      showLoading: showLoading, // 是否显示加载动画
      errorCallback: config.errorCallback, // 错误回调函数
      showError: config.showError // 是否显示错误信息
    })
    .catch((error) => {
      // 捕获请求错误
      console.log(error) // 打印错误信息
      if (error.showError) {
        // 如果配置中要求显示错误信息，则显示错误信息
        Message.error(error.msg)
      }
      return null // 返回null
    })
}

export default request
