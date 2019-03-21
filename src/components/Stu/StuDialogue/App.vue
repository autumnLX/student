<template lang="pug">
  #stu-dialogue.section(:style='{height: height}')
    Nav(:list='nav')
    div
      img(src='/static/images/stu/sync/pic_empty-08.png')
      p.f16.greyc.text-ct 该功能正在开发中
      p.f16.greyc.text-ct 即将上线哦！
      //- img(src='https://download.chivoxapp.com/assets/kami/qr-stu.png')
      //- p.p1.grey9.f18.text-ct 扫码下载{{ pname }}App
      //- p.p2.grey6.f18.text-ct 情景对话功能请用{{ pname }}App体验
</template>

<script>
/**
 * 情景对话
 */
export default {
  name: 'StuDialogue',
  data() {
    return {
      pname: window.ConfigNew.header.name,
      height: 0,
      nav: [{
        title: '首页',
        href: 'stuIndex'
      }, {
        title: '情景对话'
      }]
    }
  },
  mounted() {
    this.height = this.getNavHeight()
  }
}
</script>

<style lang="less">
#stu-dialogue {
  min-height: 613px;

  img {
    display: block;
    width: 200px;
    height: 200px;
    margin: 115px auto -25px;
  }

  .p1 {
    margin: 25px auto 15px;
    line-height: 20px;
  }

  .p2 {
    margin: 0 auto;
    line-height: 24px;
  }
}
</style>

