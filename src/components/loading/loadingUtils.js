import { Loader } from 'pixi.js'
export function formatImgList() {
  // @ts-ignore
  const context = require.context('../../assets/autoLoad/', true)
  const imgList = context.keys()
  const list = []
  for (let i = 0; i < imgList.length; i++) {
    const name = imgList[i].slice(2)
    list.push({
      name: name.slice(0, imgList[i].lastIndexOf('.') - 2),
      url: require('../../assets/autoLoad/' + name)
    })
  }
  return list
}

export function delayImgList() {
  // @ts-ignore
  const context = require.context('../../assets/delayLoad/', true)
  const imgList = context.keys()
  const list = []
  for (let i = 0; i < imgList.length; i++) {
    const name = imgList[i].slice(2)
    list.push({
      name: name.slice(0, imgList[i].lastIndexOf('.') - 2),
      url: require('../../assets/delayLoad/' + name)
    })
  }
  return list
}

export async function pixiLoading(imgUrlList, cb) {
  const loader = new Loader()
  loader.onStart.add(() => console.log('pixi加载'))
  return new Promise((resolve) => {
    loader.add(imgUrlList).load(async(res) => {
      console.log('loadingUtils',res.resources)
      //   commonHub.set('textureList', res.resources)
      resolve(res.resources)
    }).onProgress.add((params) => {
      cb && cb(params.progress)
    })
  })
}

export function imgLoading(imgUrlList, cb) {
  let progress = 0
  let count = 0
  const imgList = {
    imgs: {}
  }
  const length = imgUrlList.length
  return new Promise((resolve) => {
    imgUrlList.map((item) => {
      const imgSuccessFn = function() {
        count++
        imgList.imgs[this.bufferName] = this
        if (count === length) {
          progress = 100
          console.log('加载完成:', progress)
          resolve(null)
        } else {
          progress = Math.round(count / length * 100)
          console.log('加载中:', progress)
        }
        cb && cb(progress)
      }
      const img = new Image()
      img.onload = img.onerror = imgSuccessFn
      img.bufferName = item.name
      if (item.crossOrigin === true) {
        img.crossOrigin = 'anonymous'
      }
      img.src = item.url
    })
  })
}
