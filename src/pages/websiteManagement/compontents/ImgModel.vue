<template>
  <!--img展示 未用 -->
  <div>
    <a-drawer
      v-model:visible="props.visible"
      title=""
      :maskClosable="false"
      placement="right"
      @close="onClose1(false)"
      width="800"
      :body-style="{ paddingBottom: '80px' }"
    >
      <div>
        <img style="width:50px;heigth:50px" :src="props.img" />
      </div>
    </a-drawer>
  </div>
</template>
<script>
import { message } from 'ant-design-vue'
import { defineComponent, ref, onMounted, reactive, watch, computed, nextTick } from 'vue'
import moment from 'moment'
import { rpcPost } from '@/server/conf/index.js'
import StyleColAddTable from './StyleColAddTable'
import StyleColUpdateForm from './StyleColUpdateForm.vue'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: {},
    },
    props: {
      activeKey: {
        type: Number,
        default: 1,
      },
      queryParam: {
        type: Object,
        default: {},
      },
    },
  },
  components: {
    StyleColAddTable,
    StyleColUpdateForm,
  },

  setup(props, text) {
    const onClose1 = (bool) => {
      text.emit('child', bool)
    }

    const searchFunc = () => {
      return {
        layoutid: props.item.layoutid,
        layoutrowid: props.item.id,
      }
    }
    const model = reactive({
      visible: false,
      item: {},
    })
    const table = ref()
    const updateLayoutCol = (record) => {
      model.visible = true
      model.item = record
    }

    const removeCol = (record) => {
      let bean = { id: record.id }
      rpcPost('removeLayoutCol', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('删除成功')
          getList()
        } else {
          // message.console.error(res.message);
        }
      })
    }

    const onClose5 = () => {
      model.visible = false
    }

    //每次点击重新查询
    // watch(
    //   ()=>props.visible,
    //   (visible)=>{
    //     nextTick(()=>{
    //       table.value.refresh(true)
    //     })
    //   }
    // )

    return {
      table,
      model,
      props,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      removeCol,
      updateLayoutCol,
      onClose5,
      onClose1,
      searchFunc,
      columns: [
        {
          title: '序号',
          slots: {
            customRender: 'serial',
          },
          width: 80,
          align: 'center',
        },
        {
          title: '名称',
          dataIndex: 'name',
          width: 50,
          ellipsis: true,
        },
        // {
        //   title: '高度',
        //   dataIndex: 'height',
        //   width: 50,
        //   ellipsis: true,
        //    align: 'center',
        // },
        // {
        //   title: '是否显示',
        //   dataIndex: 'ishidden',
        //   width: 50,
        //   ellipsis: true,
        // },
        {
          title: '排序',
          dataIndex: 'sort',
          width: 30,
          ellipsis: true,
        },
        {
          title: '关联资源',
          dataIndex: 'resourcename',
          width: 50,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '组件名称',
          dataIndex: 'componentname',
          width: 50,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          slots: {
            customRender: 'action',
          },
          width: 100,
          ellipsis: true,
          align: 'center',
        },
      ],
    }
  },
})
</script>
<style scoped></style>
