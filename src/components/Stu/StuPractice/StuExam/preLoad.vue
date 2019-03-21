<template lang="pug">
  div.loading
    div(v-if='loadingStatus === "loading"')
      p.title.f24.green.fb 正在加载资源
      div.progressBox
        div.progressBarBG
          div.progressBar(:style='{width: progressPer + "%"}')
            img.progressIcon(src='/static/images/practice/ic_loading.png')
        span.progressText.f16.grey9 {{ progressPer }}%
      slot
    div(v-if='loadingStatus === "fail"')
      p.title.f24.green.fb 哎呀，网络不稳定，未加载成功
      img(src='/static/images/practice/ic_loading_fail.png')
      button.btn.btn-green(@click='handleRetryPreload') 重新加载
</template>

<script>
export default {
  data () {
    return {
      progressNum: 0,
      loadingTimer: '',
      loadingError: [],
      loadingNum: 0,
      len: 0
    }
  },
  props: {
    cntList: {
      type: Array,
      default () {
        return ['https://17ks.chivoxapp.com//1542174804323691.png', 'https://17ks.chivoxapp.com//1542174804323692.png']
      }
    },
    loadingTimeout: {
      type: Number,
      default: 150000
    },
    loadingStatus: '',
  },
  methods: {
    loadAudo (url) {
      return this.$http.get(url.replace(/([^:])\/\//g, '$1/'))
        .then(() => {
          this.progressNum++
        })
        .catch(() => {
          this.loadingError.push(url)
        })
        .finally(() => {
          this.loadingNum++
        })
    },
    load (cntList) {
      cntList.forEach(url => {
        this.loadAudo(url)
      })
    },
    handleRetryPreload () {
      this.start(this.loadingError)
      this.loadingError = []
    },
    start (cntList) {
      clearTimeout(this.loadingTimer)
      let _cntList = Object.assign([], cntList)
      this.loadingNum = 0
      this.len = _cntList.length
      this.$emit('update:loadingStatus', 'loading')
      this.loadingTimer = setTimeout(this.handleLoadFail, this.loadingTimeout)
      this.load(_cntList)
    },
    handleLoadFail () {
      clearTimeout(this.loadingTimer)
      this.$emit('update:loadingStatus', 'fail')
      this.$emit('loadFail', this.loadingError)
    },
    handleLoadAudioEnd () { // 预加载完成
      clearTimeout(this.loadingTimer)
      setTimeout(() => {
        // 保证进度条到100再显示数据
        this.$emit('update:loadingStatus', 'loaded')
        this.$emit('loadSuccess')
      })
    }
  },
  computed: {
    progressPer () {
      return this.cntList.length && (Math.round(this.progressNum / this.cntList.length * 100))
    }
  },
  watch: {
    progressPer (val) {
      if (val >= 100) {
        this.handleLoadAudioEnd()
      }
    },
    cntList: {
      immediate: true,
      handler (v) {
        if (v && v.length) this.start(v)
      }
    },
    loadingNum (v) {
      if (v && v === this.len && this.loadingError.length) {
        this.handleLoadFail()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;

  & > div {
    width: 636px;
    height: 326px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    .title {
      line-height: 30px;
      margin: 18px auto 74px;
    }

    .progressBox {
      margin-top: 80px;
      display: flex;
      justify-content: center;
      align-items: center;

      .progressBarBG {
        width: 500px;
        height: 20px;
        border-radius: 10px;
        background-color: rgba(232, 248, 241, 0.9);
        margin-right: 18px;
        float: left;

        .progressBar {
          height: 20px;
          border-radius: 10px;
          position: relative;
          background: url(/static/images/practice/ic_loadingline.png) repeat-x top right;

          .progressIcon {
            width: 70px;
            height: 70px;
            position: absolute;
            top: -80px;
            right: 0;
          }
        }
      }

      .progressText {
        line-height: 20px;
        display: inline-block;
      }
    }
    .contentDetail,
    button {
      margin-top: 42px;
    }
  }
}
</style>
