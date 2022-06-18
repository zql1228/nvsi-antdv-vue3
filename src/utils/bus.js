/*
 事件总线———— 事件的订阅发布模式
  events:{
    test1:[fn1(),fn2()],
    test2:[fn1(),fn2()],
  }
   emit('test',params) 事件发布
   on('test',fn()) 事件订阅, 
   once() 只执行一次,只订阅一次,
   off() 取消订阅,
*/
class EventBus {
  constructor() {
    this.events = {}
  }
  on(name, fn) {
    if (!this.events[name]) {
      this.events[name] = []
    }
    this.events[name].push(fn)
    return this
  }
  emit(name, ...args) {
    if (!this.events[name]) {
      return this
    }
    const fns = this.events[name]
    fns.forEach((fn) => fn.call(this, ...args))
    return this
  }
  off(name, fn) {
    if (!this.events[name]) {
      return this
    }
    if (!fn) {
      this.events[name] = null
      return this
    }
    const index = this.events[name].indexOf(fn)
    if (index > -1) {
      this.events[name].splice(index, 1)
    }
    return this
  }
  once(name, fn) {
    const only = () => {
      fn.apply(this, arguments)
      this.off(name, only)
    }
    this.on(name, only)
    return this
  }
}
export default new EventBus()
