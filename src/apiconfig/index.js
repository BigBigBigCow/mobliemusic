import axios from 'axios'
// import { Loading, Message } from 'element-ui'
import { Indicator, Toast } from 'mint-ui'
export let beasUrl = 'http://localhost:8000'
if (document.domain === 'localhost') {
  beasUrl = 'http://localhost:8000'
} else {
  beasUrl = 'http://101.132.138.74'
}
axios.defaults.timeout = 20000
axios.defaults.baseURL = ''
function startLoading () {
  Indicator.open()
}
function endLoading () {
  Indicator.close()
}
let needLoadingRequestCount = 0

export function showFullScreenLoading () {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}
// http request 拦截器
axios.interceptors.request.use(
  config => {
    config.data = JSON.stringify(config.data)
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    if (config.showLoading) {
      showFullScreenLoading()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.config.showLoading) {
      tryHideFullScreenLoading()
    }
    // console.log(response)
    if (response.data.status !== 200) {
      if (response.config.showLoading) Toast('请求错误！')
      // response.request.onerror()
    }
    return response
  },
  error => {
    tryHideFullScreenLoading()
    if (error.config.showLoading) Toast('请求错误！')
    return Promise.reject(error)
  }
)
/**
 * 封装get方法
 * @param url
 * @param params
 * @param showLoading
 * @returns {Promise}
 */

export function fetch (url, params = {}, showLoading = true) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params,
      showLoading: showLoading
    })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post (url, data = {}, config = { showLoading: true }) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}
/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}
