<script>
export default {
  name: 'tab-nav',
  props: {
    panes: {
      default: []
    },
    tabPosition: ''
  },
  data () {
    return {
      activeIndex: -1
    }
  },
  methods: {
    clickHandle (index) {
      this.activeIndex = index
      return () => this.$emit('click', index)
    }
  },
  render () {
    return (
      <div class={[this.tabPosition, 'tab-nav']}>
        {
          this._l(this.panes, (pane, index) => {
            pane.index = index
            return (
              <div
                class={['tab-nav-button', { active: pane.active }]}
                on-click={this.clickHandle(index)}>
                {pane.label}
              </div>
            )
          })
        }
      </div>
    )
  }
}
</script>

<style lang="less" scoped>
.tab-nav.top {
  border-bottom: 1px solid #efefef;
}
.tab-nav.top,
.tab-nav.bottom {
  display: flex;
  margin-left: 20px;
}
.tab-nav-button {
  cursor: pointer;
  padding: 0 10px;
  line-height: 60px;
  color: #999;
  font-size: 16px;
}
.tab-nav-button:first-child {
  margin-left: 0;
}
.active {
  color: #21bd73;
}
.active.top,
.active.bottom {
  border-bottom: 1px solid #21bd73;
}
</style>
