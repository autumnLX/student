<template lang="pug">
  i.icon-star(:style='{"background-position-y": -16 * (level - 1) + "px"}')
</template>

<script>
export default {
  name: 'Star',
  props: ['level']
}
</script>

<style lang="less">
.icon-star {
  display: inline-block;
  width: 90px;
  height: 16px;
  vertical-align: top;
  background-image: url("/static/images/stars.png");
  background-repeat: no-repeat;
}
</style>


