<template>
  <a-sub-menu :key="menuInfo.path" v-bind="$attrs">
    <template #title>
      <span>
        <MailOutlined />
        <span>{{ menuInfo.meta.title }}</span>
      </span>
    </template>
    <template v-for="item in menuInfo.children" :key="item.name">
      <template v-if="item.children && item.children.length > 0">
        <sub-menu :menu-info="item" :key="item.path" @menuHandle="menuHandle" />
      </template>
      <template v-else>
        <a-menu-item :key="item.path" @click="menuHandle(item.path)" v-if="!item.hidden && !item.meta.hidden">
          <PieChartOutlined />
          <span>{{ item.meta.title }}</span>
        </a-menu-item>
      </template>
    </template>
  </a-sub-menu>
</template>

<script>
import { PieChartOutlined, MailOutlined } from '@ant-design/icons-vue'
import { defineComponent } from 'vue'
export default defineComponent({
  name: '子菜单',
  components: {
    PieChartOutlined,
    MailOutlined,
  },
  props: {
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const menuHandle = (arg) => {
      emit('menuHandle', arg)
    }
    return {
      menuHandle,
    }
  },
})
</script>

<style scoped></style>
