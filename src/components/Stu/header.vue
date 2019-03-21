<template lang="pug">
  div.stu-header.bg-white
    div.W
      //- router-link.logo.fl(:to='{name: "stuIndex"}')
        img(src='@/assets/image/common/logo.png' alt='logo')
      img(:src='logo' ref='logo' @click='handleHome' style='cursor: point;')
      div.stu-header-linkArea.text-ct
        //- a.fr(@click='changeLang') {{$t('header.lang')}}
        a.fr.f16(href='/static/page/download.php' target='_blank') {{ $t('header.app') }}
        a.fr.f16(href='/static/page/about.php' target='_blank') {{ $t('header.about') }}
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      logo: window.ConfigNew.logoUrl('logo.stu.png')
    }
  },
  methods: {
    handleHome() {
      this.$router.push({ name: 'stuIndex' })
    },
    changeLang() {
      if (this.$i18n.locale === 'zh') {
        this.$i18n.locale = 'tw'
      } else {
        this.$i18n.locale = 'zh'
      }
    }
  },
}
</script>

<style>
@import './../../../static/styles/common/km-header.css';
</style>
