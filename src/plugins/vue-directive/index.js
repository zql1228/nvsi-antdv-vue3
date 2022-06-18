import useDrag from './drag-modal'
import useDebounce from './debounce'
const directive = [
  {
    key: 'drag',
    createDirective: useDrag,
  },
  {
    key: 'debounce',
    createDirective: useDebounce,
  },
]
export default function userVuedirective(app) {
  let dir = {}
  let filterDirective = directive.reduce((pre, cur) => {
    dir[cur.key] ? '' : (dir[cur.key] = pre.push(cur))
    return pre
  }, [])
  filterDirective.forEach(({ key, createDirective }) => {
    createDirective && createDirective(app, key)
  })
}
