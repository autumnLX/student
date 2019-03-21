<template lang="pug">
  router-view(:checkNewNotices='checkNewNotices')
</template>

<script>
export default {
  name: 'stu',
  props: ['checkNewNotices'],
  data () {
    return {
    }
  },
}
</script>
