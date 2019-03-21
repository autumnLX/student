<template lang="pug">
  #stu-bible.section(v-if='show && $store.state.isVIP')
    Nav(:list='nav')
    div.bible-list
      ul
        router-link.bg-grey8(v-for='(item, index) in list' :key='"bible" + index' tag='li' :to='{ name: "stuBibleDetail", params: { id: index } }')
          img(:src='item.img1' width='240' height='170')
          div
            p.bible-list-title.f18.ellipsis {{item.title}}
            p.bible-list-cnt.grey9 {{item.content.join('').substring(0, 100) + "......"}}
  Vip(v-else-if='show')
</template>

<script>
import Vip from '@/UIO/Vip'

export default {
  name: 'StuBible',
  components: { Vip },
  data() {
    return {
      show: false,
      nav: [{
        title: this.$t('Stu.nav.bible'),
      }],
      list: window.bibleContent
    }
  },
  created() {
    this.$ajax.get('/students/info', {}, (res) => {
      const vipInfo = res.data.vip
      this.$store.commit('setVipInfo', vipInfo)
      this.show = true
    })
  },
}
</script>

<style lang="less" scope>
#stu-bible {
  .bible-list {
    padding: 30px 20px 10px;

    li {
      width: 100%;
      height: 170px;
      border-radius: 4px;
      display: flex;
      margin-bottom: 20px;
      overflow: hidden;
      cursor: pointer;

      & > div {
        height: 100%;
        flex: 1;
        padding: 20px 30px 0;

        .bible-list-title {
          line-height: 30px;
          margin-bottom: 15px;
        }

        .bible-list-cnt {
          line-height: 20px;
        }
      }
    }
  }
}
</style>