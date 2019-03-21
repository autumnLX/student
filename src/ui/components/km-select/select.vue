<template lang="pug">
  div.select_warp(v-clickoutside="close" :class="{disabled:disabled}")
    div.input_warp(v-if="showInput" @click="handleClick")
      div
        km-input(
          :disabled="true"
          :value="inputText"
          :showBorder="false"
          :placeholder="placeholder"
          )
      i.iconfont(:class="{roate:show, roateup:show === false}") &#xe638;
    div.options_warp(v-show="show||!showInput" :class="{showBorder:showBorder}")
      slot
</template>

<script>
import clickoutside from '../../src/directives/clickoutside.js'
import kmInput from '../km-input/main'
import { valueEquals } from '../../src/utils/util.js'
import emitter from '../../src/mixins/emitter.js'
export default {
  name: 'kmSelect',
  props: {
    value: {
      required: true
    },
    multiple: {
      default: false
    },
    showCheckBox: {
      default: false
    },
    separator: {
      type: String,
      default: ','
    },
    direction: {
      default: 'column'
    },
    showInput: {
      default: true
    },
    queryText: {
      type: String
    },
    showBorder: {
      default: true
    },
    disabled: {
      default: false
    },
    placeholder: {
      type: String
    }
  },
  data () {
    return {
      show: 0,
      query: '',
      queryAll: '',
      queryList: [],
    }
  },
  mixins: [emitter],
  computed: {
    inputText () {
      return this.queryText || this.queryAll || this.query
    }
  },
  provide () {
    return {
      'select': this
    }
  },
  inject: {
    formItem: {
      default: ''
    }
  },
  directives: { clickoutside },
  components: { kmInput },
  watch: {
    value (val, oldVal) {
      console.log(val, oldVal)
      if (!valueEquals(val, oldVal)) {
        this.dispatch('km-form-item', 'change')
      }
    }
  },
  methods: {
    handleClick () {
      if (!this.disabled) {
        this.show = !this.show
      }
    },
    close () {
      if (this.show) {
        this.show = false
      }
    },
    getOptionIndex (arr = [], value) {
      return arr.indexOf(value)
    },
    handleSelect (options, ispush) {
      let value
      if (this.multiple) {
        value = (this.value || []).slice()
        const optionIndex = this.getOptionIndex(this.value, options.value)
        if (optionIndex > -1 && !ispush) {
          value.splice(optionIndex, 1)
          this.queryList.splice(optionIndex, 1)
        }
        if (optionIndex === -1 && ispush) {
          value.push(options.value)
          this.queryList.push(options.label || options.value)
        }
        this.$emit('input', value)
        this.$emit('change', value)
        this.query = this.queryList.join(this.separator)
      } else {
        if (ispush) {
          value = options.value
          this.query = options.label || options.value
          this.$emit('input', value)
          this.$emit('change', value)
          // 防止第一次非手动点击
        }
        this.close()
      }
    },
    clearSelect (options) {
      let value
      if (this.multiple) {
        value = (this.value || []).slice()
        const optionIndex = this.getOptionIndex(this.value, options.value)
        if (optionIndex > -1) {
          value.splice(optionIndex, 1)
          this.queryList.splice(optionIndex, 1)
        }
        this.query = this.queryList.join(this.separator)
      } else {
        value = ''
        this.query = ''
      }
      this.$emit('input', value)
      this.$emit('change', value)
    }
  },
  created () {
    if (this.multiple && !Array.isArray(this.value)) {
      this.$emit('input', [])
    }
    if (!this.multiple && Array.isArray(this.value)) {
      this.$emit('input', '')
    }
    this.$on('select', this.handleSelect)
    this.$on('selectAll', (a) => {
      this.queryAll = a
    })
    this.$on('deleteSelect', this.clearSelect)
  }
}
</script>

<style lang="less" scoped>
.select_warp {
  height: 100%;
  width: 100%;
  position: relative;
}
.options_warp {
  position: absolute;
  background: white;
  width: 100%;
  min-height: 150px;
  max-height: 250px;
  overflow: auto;
  box-sizing: border-box;
  z-index: 200;
}
.showBorder {
  border: 1px solid #d3d3d3;
}
.input_warp {
  display: flex;
  align-items: center;
  height: 100%;
  border: 1px solid #d3d3d3;
  box-sizing: border-box;
  > div {
    flex: 1;
    height: 100%;
  }
}
.row {
  display: flex;
}
input {
  background: white;
}
i {
  font-size: 12px;
  margin-right: 6px;
  color: #d3d3d3;
}
.roate {
  color: #24cc7c;
  animation: roate 0.5s forwards;
}
@keyframes roate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
  }
}
.roateup {
  color: #d3d3d3;
  animation: roateup 0.5s forwards;
}
@keyframes roateup {
  from {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(0deg);
  }
}
</style>
<style>
.select_warp * {
  cursor: pointer;
}
.select_warp.disabled * {
  cursor: not-allowed;
  background: #eee;
}
</style>

