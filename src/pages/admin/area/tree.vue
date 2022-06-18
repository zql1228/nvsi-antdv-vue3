<template>
  <div>
    <Tree :dataSource="dataSource" :openKeys="openKeys" :search="search"></Tree>
  </div>
</template>

<script>
import { Tree } from '@/components'
export default {
  components: {
    Tree
  },
  data() {
    return {
      dataSource: [],
      openKeys: [],
      search: null,
      replaceFields: {
        title: 'name',
        key: 'areaid'
      }
    }
  },
  created() {
    this.areaTree()
  },
  methods: {
    onSearch(e) {
      console.log(e)
      return null
    },
    areaTree(areaId) {
      this.$rpcPost('areaTree', { bean: '0' }).then(res => {
        const _treeData = res.data.child
        _treeData.forEach(element => {
          element.title = element.fullname
          element.key = element.areaid
        })
        this.dataSource = _treeData
      })
    }
  }
}
</script>

<style></style>
