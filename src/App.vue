<template lang="pug">
div
  router-view
  //- preload
</template>

<script>
import { getStudentInfo } from '@/api/index'
import preload from './components/Stu/StuPractice/StuExam/preLoad'
export default {
  name: 'App',
  components: { preload },
  beforeCreate () {
    // 获取学生信息，存入store中
    getStudentInfo(data => {
      this.$store.commit('student/init', data)
    })
  }
}
</script>

<style>
@import url('./ui/css/ui.css');
#app {
  min-width: 1180px;
  min-height: 100vh;
}
</style>
