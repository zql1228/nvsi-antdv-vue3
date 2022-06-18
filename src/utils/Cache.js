class Cache {
  constructor() {
    this.cache = Object.create(null)
    //  默认两天后删除缓存
    this.defaultTimeout = 2 * 24 * 60 * 60 * 1000
  }
  /**
   * 根据key获取缓存
   * @param {string} key
   * @returns
   */
  get(key) {
    const record = this.cache[key]
    if (!record) {
      //  缓存不存在时直接返回null
      return null
    }
    const { expire } = record
    //  判断缓存是否过期
    if (expire > Date.now()) {
      //  缓存未过期时返回缓存值
      return record.value
    }
    //  缓存过期时删除缓存并返回null
    this.destroy(key)
    return null
  }
  /**
   * 添加缓存
   * @param {string} key 缓存的key
   * @param {unknown} value 缓存的值
   * @param {number} time 缓存的过期时间
   * @param {Function} timeoutCallback 缓存过期时的回调函数
   */
  set(key, value, time = this.defaultTimeout, timeoutCallback) {
    const oldRecord = this.cache[key]
    if (oldRecord) {
      clearTimeout(oldRecord.timeout)
    }
    const record = {
      value,
      expire: Date.now() + time,
    }
    const cb = () => {
      this.destroy(key)
      if (timeoutCallback) {
        try {
          timeoutCallback(key, value)
        } catch {}
      }
    }
    record.timeout = setTimeout(cb, time)
    this.cache[key] = record
  }
  /**
   * 清除所有缓存
   */
  clear() {
    for (let key in this.cache) {
      clearTimeout(this.cache[key].timeout)
    }
    this.cache = Object.create(null)
  }
  /**
   * 删除某个缓存
   * @param {string} key
   */
  destroy(key) {
    const oldRecord = this.cache[key]
    if (oldRecord) {
      clearTimeout(oldRecord.timeout)
      delete this.cache[key]
      return true
    }
    return false
  }
}

export default Cache
// module.exports = Cache
