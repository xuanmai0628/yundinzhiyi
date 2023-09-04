/** -----------图片相关------------- */
/** 加载图片 */
export function getImg(src, anonymous = false) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    anonymous && (img.crossOrigin = 'Anonymous')
    img.onload = () => {
      resolve(img)
    }
    img.onerror = () => reject
    img.src = src
  })
}

/** -----------字符串相关------------- */
/** 简单获取字符串长度 */
export function get_len(str) {
  if (str == null) return 0
  if (typeof str !== 'string') {
    str += ''
  }
  return str.replace(/[^\x00-\xff]/g, '01').length
}

/** 超出长度文字省略 */
export function fontNumber(text, textNumber) {
  const { length } = text
  if (length > textNumber) {
    let str = ''
    str = `${text.substring(0, textNumber)}...`
    return str
  } else {
    return text
  }
}

/** -----------数相关------------- */
/** 获取m~n的随机数, 取整方向floor or ceil 默认floor */
export const getRandom = (m, n, isFloor = true) => {
  return isFloor ? Math.floor(Math.random() * (n - m) + m) : Math.ceil(Math.random() * (n - m) + m)
}

/** 查询数组中是否存在某个元素并返回元素第一次出现的下标 */
export function inArray(item, data) {
  for (let i = 0; i < data.length; i++) {
    if (item === data[i]) {
      return i
    }
  }
  return -1
}

/** 根据id查找数组 */
export function getArrayItem(arr, id) {
  return arr.find((item) => item.id === id)
}

/** -----------对象相关------------- */

/** 在对象中添加某个属性 */
export function addObjectAttr(obj, attr, value) {
  obj[attr] = value
}

/** 浅拷贝对象*/
export function copyObject(obj) {
  return Object.assign({}, obj)
}

/** 深拷贝 */
export function copy(target) {
  const checkedType = target => Object.prototype.toString.call(target).replace(/\[object (\w+)\]/, '$1').toLowerCase()
  let result
  const type = checkedType(target)
  if (type === 'object') result = {}
  else if (type === 'array') result = []
  else return target
  for (const key in target) {
    if (checkedType(target[key]) === 'object' || checkedType(target[key]) === 'array') {
      result[key] = copy(target[key])
    } else {
      result[key] = target[key]
    }
  }
  return result
}

/** -----------功能相关------------- */
/** 防抖 */
export function debounce(fn, wait, immediate = false) {
  let timer
  let startTimeStamp = 0
  let context
  let args

  const run = (timerInterval) => {
    timer = setTimeout(() => {
      const now = new Date().getTime()
      const interval = now - startTimeStamp
      if (interval < timerInterval) {
        startTimeStamp = now
        run(wait - interval) // reset timer for left time
      } else {
        if (!immediate) {
          fn.apply(context, args)
        }
        clearTimeout(timer)
        timer = null
      }
    }, timerInterval)
  }

  return function() {
    context = this
    args = arguments
    const now = new Date().getTime()
    startTimeStamp = now // set timer start time

    if (!timer) {
      if (immediate) {
        fn.apply(context, args)
      }
      run(wait) // last timer alreay executed, set a new timer
    }
  }
}

/** 等待 */
export const delay = async(milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

/** 类型校验 */
export const typeOf = function(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

/** 获取url参数 */
export const getSearchParams = () => {
  const searchPar = new URLSearchParams(window.location.search)
  const paramsObj = {}
  for (const [key, value] of searchPar.entries()) {
    paramsObj[key] = value
  }
  return paramsObj
}

/** -----------页面相关------------- */
/** 获取窗口可视范围的高度 */
export function getClientHeight() {
  let clientHeight = 0
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
  } else {
    clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
  }
  return clientHeight
}

/** 获取窗口可视范围的宽度 */
export function getPageViewWidth() {
  const d = document
  const a = d.compatMode === 'BackCompat' ? d.body : d.documentElement
  return a.clientWidth
}

/** 获取滚动条距顶部高度 */
export function getPageScrollTop() {
  const a = document
  return a.documentElement.scrollTop || a.body.scrollTop
}

/** 滚动到页面顶部 */
export const scrollToTop = () => {
  const height = document.documentElement.scrollTop || document.body.scrollTop
  if (height > 0) {
    window.requestAnimationFrame(scrollToTop)
    window.scrollTo(0, height - height / 8)
  }
}

/** 滚动到某个元素 */
export const smoothScroll = element => {
  document.querySelector(element).scrollIntoView({
    behavior: 'smooth'
  })
}

/** -----------平台相关------------- */
const getPlatform = () => {
  const { platform } = navigator
  if (platform) {
    if (/(iphone|ipod|ipad)/.test(navigator.userAgent.toLowerCase())) return 'iOS'
    if (/android/.test(navigator.userAgent.toLowerCase())) return 'Android'
    return platform
  }
}

export function getPlatformFun() {
  return getPlatform()
}
// 是否x系列
export function isIphoneXSeries() {
  if (getPlatform() === 'iOS') {
    if (window.screen.width >= 375 && window.screen.height >= 812) {
      return true
    }
  }
  return false
}
// 是否P40系列
export function isAndroidPSeries() {
  if (getPlatform() === 'Android') {
    if (window.screen.width >= 360 && window.screen.height >= 790) {
      return true
    }
  }
  return false
}
// 是否是ios9以下机型 兼容flex
export function isIOS9Series() {
  if (getPlatform() === 'iOS') {
    const ver = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
    // console.log(ver)
    const vernum = parseInt(ver[1], 10)
    if (vernum < 9) {
      return true
    }
  }
  return false
}
