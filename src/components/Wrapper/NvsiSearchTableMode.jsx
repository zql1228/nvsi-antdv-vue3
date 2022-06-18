export default {
  name: '',
  data() {
    return {}
  },
  props: {
    // 是否使用行政区划树的结构
    mode: {
      type: String,
      default: 'monomer'
    }
  },
  watch: {},
  created() {},
  methods: {},

  render() {
    return this.mode === 'recombination' ? (
      <nvsi-tree-table-wrapper {...{ scopedSlots: { ...this.$scopedSlots } }}>
        <template slot="table-wrapper">
          <nvsi-search-table {...{ scopedSlots: { ...this.$scopedSlots } }}></nvsi-search-table>
        </template>
      </nvsi-tree-table-wrapper>
    ) : (
      <nvsi-page-search-table {...{ scopedSlots: { ...this.$scopedSlots } }}></nvsi-page-search-table>
    )
  }
}
