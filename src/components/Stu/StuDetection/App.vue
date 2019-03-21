<template lang="pug">
  div#app
    Header(ref='header')
    div#main.W.section
      Detection(style='height: 460px;' :goBack='backToHistory' :needSkip='true')
    Footer(ref='footer')
    Sidebar(ref='sidebar')
    Dialog(:dialogConfig='$store.state.ssoCfg' :isShowDialog='$store.state.isShowSsoD')
    Dialog(:dialogConfig='$store.state.newTaskCfg' :isShowDialog='$store.state.isShowNewTaskD')
    Dialog(:dialogConfig='$store.state.dCfg' :isShowDialog='$store.state.isShowErrD')
</template>

<script>
import Header from '@/components/Stu/header'
import Footer from '@/components/Stu/footer'
import Detection from './detection'

export default {
  name: 'detection',
  components: Object.assign({}, { Header, Footer, Detection }),
  data () {
    return {
    }
  },
  methods: {
    backToHistory() {
      this.$router.go(-1)
    }
  },
  created() {
    this.isDetect = !(this.$route.query.checkdevice === '1')

    if (!this.$store.state.$recorder) {
      this.$store.commit('initAiPanel')
    }
  },
  beforeDestroy() {
    this.$store.state.$player.stop()
    this.$store.state.$recorder.stop()
  }
}
</script>

<style lang='less' scoped>
#app {
  display: flex;
  flex-direction: column;

  #main {
    margin: 20px auto;
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
