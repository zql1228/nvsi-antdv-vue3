<template>
  <div>{{ sreachColumns }}</div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: '',
  props: {
    sreachColumns: Array,
    default: () => [],
  },
  setup() {
    return {}
  },
})
</script>

<style scoped></style>
