<!-- 行政区划树 -->
<template>
  <a-tree
    :load-data="onLoadData"
    :tree-data="treeData"
    :replaceFields="replaceFields"
    :expandedKeys="expandedKeys"
    :style="{ background: '#fff', overflow: 'auto', height: '100%', padding: '8px', borderRadius: '2px' }"
    @expand="onExpand"
    @select="onSelect"
  ></a-tree>
</template>

<script>
import { Tree } from '@/components'
import Bus from '@/utils/bus'

export default {
  components: {
    Tree,
  },
  props: {
    showLevel: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {
      treeData: [],
      expandedKeys: [],
      replaceFields: {
        title: 'area',
        key: 'areaid',
      },
    }
  },
  created() {
    this.initTreeData()
  },
  methods: {
    onSelect(selectedKeys, info) {
      Bus.$emit('areaTreeSelected', { selectedKeys, info })
    },
    initTreeData() {
      // 这里要获取当前登录人的区划， 先不实现
      const userAreaId = '0'
      this.searchAreaTree(userAreaId).then((res) => {
        this.treeData = res
      })
    },
    searchAreaTree(areaId) {
      return new Promise((resolve) => {
        this.$rpcPost('areaTree', { bean: areaId }).then((res) => {
          const _treeData = res.data.child
          resolve(_treeData)
        })
      })
    },
    onLoadData(treeNode) {
      return new Promise((resolve) => {
        // 这个判断行政区划表单控件可以抄一下
        if (treeNode.dataRef.children || treeNode.dataRef.level > this.showLevel - 1) {
          resolve()
          return
        }
        this.$rpcPost('areaTree', { bean: treeNode.dataRef.areaid }).then((res) => {
          const _child = res.data.child
          if (_child) {
            _child.forEach((element) => {
              element.isLeaf = element.level === this.showLevel
            })
          }

          treeNode.dataRef.children = _child
          this.treeData = [...this.treeData]
          resolve()
        })
      })
    },
    // 展开折叠触发
    onExpand(expandedKeys, { expanded: bool, node }) {
      // true 展开 false 折叠
      if (bool) {
        this.expandedKeys = expandedKeys.filter((item) => {
          const areaId = node.dataRef.areaid
          const provinceAreaId = areaId.substring(0, 2)
          const exProviceAreaId = item.substring(0, 2)
          // 这里代码需要优化 lix @wangsy
          if (node.dataRef.level === 2) {
            const cityAreaId = areaId.substring(2, 4)
            const exCityAreaId = item.substring(2, 4)
            if (exCityAreaId !== '00') {
              if (exCityAreaId === cityAreaId) {
                return true
              } else {
                return false
              }
            }
          }
          if (exProviceAreaId === provinceAreaId) {
            return true
          } else {
            return false
          }
        })
      } else {
        this.expandedKeys = expandedKeys
      }
    },
  },
}
</script>

<style></style>
