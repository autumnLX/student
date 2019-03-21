<template lang="pug">
  div.pane(v-if="!lazy || active || hasRender")
    div(v-show="active")
      slot
</template>

<script>
export default {
  name: 'km-tab-pane',
  data () {
    return {
      index: -1,
      hasRender: false
    }
  },
  inject: ['tabs'],
  props: {
    label: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    lazy: {
      default: true
    }
  },
  computed: {
    active () {
      return this.tabs.activeIndex === this.index
    }
  },
  watch: {
    active: {
      immediate: true,
      handler (v) {
        if (v) this.hasRender = true
      }
    }
  }
}
</script>

<style lang="less">
</style>
