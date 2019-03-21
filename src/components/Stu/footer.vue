<template lang="pug">
  div.stu-footer
    div
      p.fl.text-ct.stu-footer-info
        span.fl
          a.fl.f12.grey9(href='/static/page/youngsters.php' target='_blank') {{$t('footer.youth')}}
          i
        span.fl
          a.fl.f12.grey9(href='/static/page/declare.php' target='_blank') {{$t('footer.declare')}}
          i
        span.fl.f12.grey9
          | {{ copyright + $t('footer.copyright') }}
          i
        span.fl.f12.grey9
          a.f12.grey9(href='http://www.miitbeian.gov.cn' target='_blank') {{ icp }}
        span.fl.f12.gong-an(v-if='icon')
          a.f12.grey9(:href='"http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=" + police' target='_blank' name='abc') 苏公网安备{{police}}号
      div.stu-footer-browser
        a.fl.f12.grey9(href='http://17ks.chivoxapp.com/guide/360Browse.exe') 
          img.fl(src='@/assets/image/common/icon_browser-360.png' alt='360')
          | {{$t('footer.browser360')}}
        a.fl.f12.grey9(href='http://17ks.chivoxapp.com/guide/QQBrowser.exe')
          img.fl(src='@/assets/image/common/icon_browser-qq.png' alt='QQ')
          | {{$t('footer.browserqq')}}
</template>

<script>
export default {
  name: 'Footer',
  data() {
    const { copyright, icp, police, icon } = window.ConfigNew.footer
    return {
      copyright,
      icp,
      police,
      icon
    }
  }
}
</script>

<style>
@import './../../../static/styles/common/km-footer.css';
.gong-an {
  padding-left: 25px !important;
  margin-left: 5px;
  background: url('/static/images/abc.png') no-repeat left center;
}
</style>
