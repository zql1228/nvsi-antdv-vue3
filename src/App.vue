<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
export default {
  components: {},
  data() {
    return {
      locale: zhCN,
    }
  },
}
</script>
<style></style>
