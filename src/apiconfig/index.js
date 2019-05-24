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
    // const token = this.getCookie('session') // 获取Cookie
    config.data = JSON.stringify(config.data)
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    if (config.showLoading) {
      showFullScreenLoading()
    }
    // if (token) {
    //   config.params = {'cookie': token}
    // }
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
    // console.log(response.data)
    if (response.data.status !== 200 && response.data.status !== 301) {
      if (response.config.showLoading) Toast(response.data.body.msg || '请求错误！')
      // response.request.onerror()
    }
    // for (let i = 0; i < response.cookie; i++) {
    //   console.log(response.cookie[i])
    // }
    if (response.data.cookie.length > 0) {
      console.log(response.data.cookie)
      // response.headers['set-cookie'] = response.data.cookie[0]
      document.cookie = response.data.cookie[0]
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
      showLoading: showLoading,
      withCredentials: true
    })
      .then(response => {
        // console.log(response.data)
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
