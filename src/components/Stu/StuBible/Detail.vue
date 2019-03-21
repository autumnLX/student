<template lang="pug">
  #stu-bible.section
    Nav(:list='nav')
    div.bible-detail
      img(:src='bible.img2')
      div.bible-detail-content
        p(v-for='single in bible.content') {{single}}
</template>


<script>
export default {
  name: 'StuBibleDetail',
  data() {
    return {
      nav: [{
        title: this.$t('Stu.nav.bible'),
        href: 'stuBible'
      }, {
        title: ''
      }],
      bible: {}
    }
  },
  methods: {
  },
  mounted() {
    this.bible = window.bibleContent[this.$route.params.id]
    this.$set(this.nav, 1, { title: this.bible.title })
  }
}
</script>

<style lang="less" scope>
#stu-bible {
  .bible-detail {
    padding: 30px 0 6px;

    img {
      margin: 0 30px 30px;
      border-radius: 4px;
    }

    .bible-detail-content {
      padding: 0 75px;

      p {
        font-size: 16px;
        line-height: 32px;
        margin-bottom: 24px;
      }
    }
  }
}
</style>
