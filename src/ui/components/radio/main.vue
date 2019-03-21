<template lang="pug">
  span.radio(:class="{radio_active:isActive}" @click.stop.prevent="clickHandle")
   i.iconfont(:class="{radio_active:isActive}" v-if="!group" v-show="isActive") &#xe627;
   i.iconfont(v-show="!isActive" v-if="!group") &#xe641;
   label(v-if="!$slots.default") {{ label }} 
   label(v-else)
    slot
</template>

<script>
import emitter from '../../src/mixins/emitter.js'
export default {
  name: 'km-radio',
  props: {
    value: '',
    label: {
      required: true
    }
  },
  inject: {
    group: {
      default: null
    }
  },
  mixins: [emitter],
  computed: {
    isActive () {
      return this.rel_value === this.label
    },
    rel_value () {
      return this.group ? this.group.value : this.value
    }
  },
  methods: {
    clickHandle () {
      if (this.rel_value !== this.label) {
        this.$emit('input', this.label)
        this.$emit('change', this.label)
        this.dispatch('km-radio-group', 'change', this.label)
        this.dispatch('km-form-item', 'change')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.radio {
  cursor: pointer;
  margin-right: 20px;
}
.radio:last-of-type {
  margin-right: 0;
}
.radio_active {
  color: #24cc7c;
}
.radio_active label {
  color: #24cc7c;
}
.iconfont {
  margin-right: 8px;
}
label {
  cursor: pointer;
  display: inline-block;
}
</style>
