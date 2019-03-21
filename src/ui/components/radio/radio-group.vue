<template lang="pug">
  div.radioGroup(:class="{border: border}")
    slot
</template>

<script>
export default {
  name: 'km-radio-group',
  props: {
    value: '',
    border: {
      default: false
    }
  },
  provide () {
    return {
      group: this
    }
  },
  created () {
    this.$on('change', (value) => {
      this.$emit('input', value)
    })
  }
}
</script>

<style>
</style>
