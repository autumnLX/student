export default {
  namespaced: true,
  state: {
    recordBtnDisable: false,
    replayShow: true,
    // currentNext 单前页面切换
    nextBtnFlag: 'Next',
    nextIndex: 0,
    nextBtnDisable: false
  },
  mutations: {
    setRecordBtnDisable(state, flag) {
      state.recordBtnDisable = flag
    },
    setReplayShow(state, flag) {
      state.replayShow = flag
    },
    setNextBtnFlag(state, flag) {
      state.nextBtnFlag = flag
    },
    next(state) {
      state.nextIndex++
    }
  }
}
