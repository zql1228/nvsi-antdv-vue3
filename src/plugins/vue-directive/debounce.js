import { nextTick, onMounted, watch } from 'vue'
export default function useDebounce(app, key) {
  app.directive(key, {
    inserted: function (el, binding) {
      let timer
      el.addEventListener('click', () => {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          binding.value()
        }, 1000)
      })
    },
  })
}
