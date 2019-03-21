<script>
import TabNav from './tab-nav'
export default {
  name: 'km-tabs',
  components: { TabNav },
  props: {
    tabPosition: {
      type: String,
      default: 'top',
    },
    value: ''
  },
  provide () {
    return {
      tabs: this
    }
  },
  data () {
    return {
      panes: [],
      activePane: ''
    }
  },
  methods: {
    setCurrent (index) {
      this.activePane = this.panes[index]
      this.$emit('input', this.panes[index].label)
    },
    getPanes () {
      const panes = []
      if (this.$slots.default) {
        this.$slots.default.forEach((vnode) => {
          if (vnode.componentOptions && vnode.componentOptions.Ctor.options.name === 'km-tab-pane') {
            panes.push(vnode.componentInstance)
          }
        })
      }
      if (panes.length !== this.panes.length || panes.some((pane, index) => pane !== this.panes[index])) {
        this.panes = panes;
      }
    }
  },
  render (createElement) {
    const props = {
      props: {
        panes: this.panes,
        tabPosition: this.tabPosition
      }
    }
    const header = (
      <div class={['tab_header']}>
        <tab-nav {...props} on-click={this.setCurrent}></tab-nav>
      </div>
    )
    const content = (
      <div class="tab_content">
        {this.$slots.default}
      </div>
    )
    return (
      <div class={['clear', this.tabPosition]}>
        {this.tabPosition === 'bottom' ? [content, header] : [header, content]}
      </div >
    )
  },
  mounted () {
    this.getPanes()
  },
  updated () {
    this.getPanes()
  },
  computed: {
    activeIndex () {
      let pane
      if (this.activePane) {
        pane = this.activePane
      } else if (this.value) {
        pane = this.panes.filter(pane => pane.label === this.value)[0]
      }
      if (pane) {
        return pane.index
      } else {
        return 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
.clear {
  overflow: hidden;
  zoom: 1;
}
.tab_content {
  position: relative;
  text-align: left;
}
.right {
  .tab_header {
    float: right;
    margin-left: 10px;
    border-left: 1px solid #efefef;
  }
}
.right {
  .tab_header {
    float: right;
    margin-left: 10px;
    border-left: 1px solid #efefef;
  }
}
.left {
  .tab_header {
    float: left;
    margin-right: 10px;
    border-right: 1px solid #efefef;
  }
}
</style>
