<template lang="pug">
	i.icon-radio(@click="toggle" :class='{"active": flag}')
</template>
<script>
export default {
  name: 'radio',
  props: ['flag', 'property'],
  data() {
    return {
    }
  },
  methods: {
    toggle() {
      this.$emit('toParent', this.property)
    }
  },
  mounted() {
  }
}
</script>
<style lang="less">
.icon-radio {
	display: inline-block;
  width: 16px;
  height: 16px;
  vertical-align: middle;
  background-image: url("/static/images/icon_common.png");
  background-repeat: no-repeat;
  background-position-x: -48px;
  margin-right: 8px;
  &.active {
  	background-position-x: -32px;
  }
}
</style>