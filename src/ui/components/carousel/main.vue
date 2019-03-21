<script>
import { on, remove } from '../../src/utils/dom.js'
export default {
  name: 'carousel',
  render (h) {
    let spot = ''
    if (this.showSpot) {
      spot = (<ul> {this._l(this.items, (node, index) => { return (<li class={[{ active: index === this.active_index }]} on-click={this.anmiate(index - this.active_index)}></li>) })}
      </ul>)
    }
    return (
      <div class="carousel">
        {this._l(this.items, node => {
          return node
        })}
        {spot}
        <div class="arrow">
          <div on-click={this.anmiate(-1)}>left</div>
          <div on-click={this.anmiate(1)}>right</div>
        </div>
      </div >
    )
  },
  data () {
    return {
      items: [],
      total_items: [],
      processItems: [],
      width: 0,
      height: 0,
      length: 0,
      active_index: 2
    }
  },
  provide () {
    return {
      carousel: this
    }
  },
  computed: {
    flag () {
      return this.type === 'card' ? -2 : -1
    }
  },
  props: {
    activeIndex: {
      type: Number,
      default: 0
    },
    type: {
      default: ''
    },
    showSpot: {
      default: true
    }
  },
  methods: {
    getItems () {
      this.items = []
      if (this.$slots.default) {
        this.items = this.$slots.default.filter(node => {
          return node.componentOptions && node.componentOptions.Ctor.options.name === 'carousel-item'
        })
      }
      this.processItems = this.items
      this.total_items = [...this.items, ...this.items, ...this.items]
      this.length = this.items.length
    },
    getSize () {
      this.$nextTick(() => {
        this.width = this.$el.offsetWidth
        this.height = this.$el.offsetHeight
      })
    },
    setActiveIndex (addNum) {
      const index = (this.active_index || this.activeIndex) + addNum
      if (index > this.flag) {
        this.active_index = (index) % this.length
      } else {
        this.active_index = this.length + this.flag
      }
      if (this.items.length === 2) {
        this.items.forEach((node, index) => {
          node.componentInstance.index = index - this.active_index
        })
        return
      }

      this.processItems = this.total_items.slice(this.length + this.active_index + this.flag, this.length * 2 + this.active_index + this.flag)

      if (this.type === 'card' && this.items.length === 3) {
        this.processItems.forEach((node, index) => {
          node.componentInstance.index = index + this.flag === -2 ? 1 : index + this.flag
        })
        return
      }

      this.processItems.forEach((node, index) => {
        node.componentInstance.index = index + this.flag
      })
    },
    setIndex () {
      this.$nextTick(() => {
        this.items.forEach((node, index) => {
          node.componentInstance.u_index = index
        })
        this.setActiveIndex(0)
      })
    },
    anmiate (num) {
      return () => {
        this.setActiveIndex(num)
      }
    }
  },
  mounted () {
    this.getItems()
    this.setIndex()
    this.getSize()
    // setInterval(() => {

    // }, 3000)
    on(window, 'resize', this.getSize)
  },
  destroyed () {
    remove(window, 'resize', this.getSize)
  }
}
</script>

<style lang="less" scoped>
.carousel {
  height: 200px;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
}
.arrow {
  position: absolute;
  z-index: 100;
}
</style>
