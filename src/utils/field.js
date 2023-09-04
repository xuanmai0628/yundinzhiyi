class Basics {
    _obj = {};
    _default = 'default';
    _created(name = this._default) {
      // 定义消息队列和离线消息队列
      const list = {}
      let offLine = new Set()
      const then = this
      const obj = {
        // 触发，如果第一次触发就添加到离线队列中
        commit(key, ...rest) {
          const fn = () => {
            const arr = [list, key, ...rest]
            return then._commit.apply(then, arr)
          }
          if (offLine) {
            offLine.add(fn)
          }
          return fn()
        },
        // 添加订阅者同时执行离线队列
        on(key, fn) {
          then._subscribe(...[list, key, fn])
          if (offLine) {
            offLine.forEach(f => f())
          }
          offLine = null
        },
        // 删除，key是必须的
        remove(key, fn) {
          const v = this.list[key]
          if (!v) {
            return false
          }
          if (v.has(fn)) {
            return v.delete(fn)
          }
          // clear没有返回值，这里返回一个true
          return v.clear() || true
        },
        // 存储信息
        set(key, value) {
          console.log(value, JSON.stringify(value))
          if (typeof (value) === 'object') value = JSON.stringify(value)
        //   localStorage.setItem(key, value)
        },
        // 读取信息
        get(key) {
          try {
            return JSON.parse(localStorage.getItem(key))
          } catch (error) {
            return localStorage.getItem(key)
          }
        },
        // 删除存储信息
        removeItem(key) {
          localStorage.removeItem(key)
        }
      }
      // 判断命名来决定返回
      return name
        ? this._obj[name]
          ? this._obj[name]
          : (this._obj[name] = obj)
        : obj
    }
    // 触发
    _commit(l, k, ...args) {
      const v = l[k]
      if (!v || !v.size) {
        return
      }
      return Array.from(v, f => f.apply(this, args), this)
    }
    _subscribe(list, key, fn) {
      if (!list[key]) {
        list[key] = new Set()
      }
      list[key].add(fn)
    }
}
// 这个是实现类
class Watch extends Basics {
  constructor() {
    // 必须，es6规定
    super()
    this.created = super._created
  }
  commit(key, ...rest) {
    const v = this.created()
    v.commit(key, ...rest)
  }
  on(key, fn) {
    const v = this.created()
    v.on(key, fn)
  }
  remove(key, fn) {
    const v = this.created()
    v.remove(key, fn)
  }
  set(key, value) {
    const v = this.created()
    v.set(key, value)
  }
  get(key) {
    const v = this.created()
    v.get(key)
  }
  removeItem(key) {
    const v = this.created()
    v.removeItem(key)
  }
}

export default Watch
