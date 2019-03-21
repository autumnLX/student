<template lang="pug">
  #banner
    div.swiper-container(v-if='bannerWorkList.length >= 2')
      div.swiper-wrapper
        div.swiper-slide.slide(v-for='banner in bannerWorkList' @click='link(banner.practiceParam)')
          img(:src='banner.bookCover' alt='')
      div.swiper-pagination
    div.single(v-else-if='bannerWorkList.length === 1' @click='link(bannerWorkList[0].practiceParam)')
      img(:src='bannerWorkList[0].bookCover')
</template>

<script>
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'

export default {
  name: 'BannerList',
  props: ['bannerWorkList'],
  data() {
    return {
      swiper: ''
    }
  },
  methods: {
    swiperContainer() {
      if (!this.swiper) {
        this.swiper = new Swiper('.swiper-container', {
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          autoplay: true,
          loop: true
        })
      }
    },
    // getTodoBannerPractice() {
    //   this.$ajax.post('/practices/getTodoBannerPractice', {}, (res) => {
    //     if (res.status === 1) {
    //       this.bannerWorkList = res.data.list
    //       this.bannerWorkList.forEach((value, index) => {
    //         if (value.type === 'competition') {
    //           this.bannerWorkList[index].bookCover = this.$config.resUrl + value.bookCover
    //         }
    //       })
    //       this.getBannerCount(res.data.pageInfo.total)
    //       if (this.bannerWorkList.length) {
    //         this.$nextTick(() => {
    //           this.swiperContainer()
    //         })
    //       }
    //     }
    //   })
    // },
    link(param) {
      this.$router.push({ name: 'stuExamDetail', query: { competitionId: param.competitionId, groupId: param.groupId, stageId: param.stageId } })
    }
  },
  mounted() {
    // this.getTodoBannerPractice()
    if (this.bannerWorkList.length) {
      this.$nextTick(() => {
        this.swiperContainer()
      })
    }
  }
}
</script>
<style lang='less' scoped>
.swiper-wrapper {
  width: 100%;
  border-radius: 5px;

  & > div {
    height: 310px;
    border-radius: 5px;
  }

  & .slide {
    background: #ccc;
    cursor: pointer;

    & img {
      display: block;
      width: 100%;
      height: 310px;
      border-radius: 5px;
      cursor: pointer;
    }
  }
}
.single {
  height: 310px;
  border-radius: 5px;

  & img {
    display: block;
    width: 100%;
    height: 310px;
    border-radius: 5px;
    cursor: pointer;
  }
}
</style>