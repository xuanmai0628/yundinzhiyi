import { Application, Container, utils, Sprite, Graphics, Text } from 'pixi.js'
import Config from '../Config'
const Cache = utils.TextureCache
const PX = {
  res: {},
  app: {},
  stage: new Container(),
  widgetPool: [],

  init(canvasEl, width, height) {
    const app = new Application({
      view: canvasEl,
      width,
      height,
      transparent: true,
      backgroundColor: 0x000000
    })

    this.res = Cache
    this.app = app
    this.stage = app.stage
    app.stage.interactive = true

    const getDOMRect = () => {
      this.DOMRect = app.view.getBoundingClientRect()
      this.domStageRatio = this.app.screen.width / this.DOMRect.width
      if (this.DOMRect.width !== 0) {
        this.app.ticker.remove(getDOMRect, this)
        this._setWidget()
      }
    }

    this.app.ticker.add(getDOMRect, this)

    // 适配横竖屏变化
    const resizeStage = (e) => {
      this.DOMRect = app.view.getBoundingClientRect()
      this.domStageRatio = this.app.screen.width / this.DOMRect.width
      this._setWidget()

      var winWidth = document.documentElement.clientWidth
      var winHeight = document.documentElement.clientHeight
      if (e && winWidth / winHeight < 1.2 && winWidth / winHeight > 0.8) {
        return false
      }
      if (winWidth < winHeight) {
        this.app.renderer.resize(750, 1600)
        this.app.stage.rotation = Math.PI / 2
        this.app.stage.x = 750
        canvasEl.style.transform = 'translate(-50%, -50%) rotate(-90deg)'
        // canvasEl.style.transform = 'rotate(-90deg)';
        canvasEl.style.width = '7.5rem'
        canvasEl.style.height = '16rem'
        // canvasEl.style.marginTop = '-4.26rem';
        // canvasEl.style.marginLeft = '4.26rem';
        // canvasEl.style.marginTop = '-3.75rem';
      } else {
        this.app.renderer.resize(1600, 750)
        this.app.stage.rotation = 0
        this.app.stage.x = 0
        canvasEl.style.transform = 'translate(-50%, -50%) rotate(0deg)'
        // canvasEl.style.transform = 'rotate(0deg)';
        canvasEl.style.height = '7.5rem'
        canvasEl.style.width = '16rem'
        // canvasEl.style.marginTop = '0rem';
        // canvasEl.style.marginLeft = '0rem';
      }
    }
    resizeStage()
    window.addEventListener('orientationchange' in window ? 'orientationchange' : 'resize', resizeStage)
    window.addEventListener('οnresize' in window ? 'onresize' : 'resize', resizeStage)
  },

  getNewApp(canvasEl, width, height) {
    return new Application({
      view: canvasEl || document.createElement('canvas'),
      width: width || 750,
      height: height || 1600,
      transparent: true,
      backgroundColor: 0x000000
    })
  },

  /**
     * 添加Container
     * @param {PIXI.Container} parent 父元素
     * @param {string} [name] 此元素名称
     * @return {*}  {PIXI.Container}
     */
  addCtn(parent, name) {
    const ctn = new Container()
    name && (ctn.name = name)
    parent.addChild(ctn)
    return ctn
  },

  addSprite(parent, cacheName, x, y, w, h, gx, gy, interactive) {
    const sprite = new Sprite(Cache[cacheName])
    let graphics
    sprite.position.set(x, y)
    sprite.name = cacheName
    if (!interactive) {
      parent.addChild(sprite)
      return sprite
    } else {
      graphics = new Graphics()
      graphics.beginFill(0x000000)
      graphics.alpha = 0
      graphics.drawRect(gx, gy, w, h)
      graphics.name = cacheName
      graphics.zIndex = 3
      graphics.interactive = true
      Config.spriteList[cacheName] = sprite
      parent.addChild(sprite, graphics)
      return graphics
    }
  },

  /**
     * 添加矩形框
     * @param {PIXI.Container} parent
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {boolean} [interactive]
     * @param {number} [alpha]
     * @param {number} [tint=0xFFFFFF] 颜色值 默认0xFFFFFF
     * @return {*}  {PIXI.Graphics}
     */
  addRect(parent, x, y, w, h, interactive, alpha, tint = 0xFFFFFF) {
    const graphics = new Graphics()
    graphics.beginFill(tint, alpha || 0)
    graphics.drawRect(x, y, w, h)
    graphics.endFill()
    interactive && (graphics.interactive = true)
    parent && parent.addChild(graphics)
    return graphics
  },

  addText(parent, text, x, y, fontSize, tint, align, fontWeight) {
    const textS = new Text(text, {
      fontSize: fontSize,
      fill: tint,
      align: align,
      fontWeight: fontWeight
    })
    textS.position.set(x, y)

    parent.addChild(textS)

    return textS
  },

  show(target, duration = 500, callback, delay) {
    // _orderly(target, (ele) => {
    //   ele.alpha = 0
    //   ele.visible = true
    //   gsap.to(target, {
    //     duration: duration || 0,
    //     alpha: 1,
    //     delay: delay || 0,
    //     ease: 'none',
    //     onComplete: function() {
    //       callback && callback()
    //     }
    //   })
    // })
  }

}

export default PX
