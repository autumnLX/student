import Ajax from '@/util/Ajax'
import Util from '../util/Util'
import Api from './../../static/Api'

function improtVue(Vue) {
  Ajax.init(Vue)
}

/*
 * url 接口地址
 * params 请求参数
 * callback 请求回调 (res.data, res.status)
 * addons 其他一坨参数
 *  serverUrl 请求地址 不填就是目前的地址
 *  notNeedJson 返回值是否需要json处理
 *  notNeedStatus 是否需要接管status
 *  failCallback status!==1的回调 与notNeedJson互斥 (res.status, res.info, '我知道了') 我知道了： 由于按钮文字用了i18n 所以用参数穿
*/

const $post = function(url, params, callback, addons) {
  Ajax.postNew(url, params, callback, addons || {})
}

const $get = function(url, params, callback, addons) {
  Ajax.getNew(url, params, callback, addons || {})
}

const $jsonp = (url, params, callback, addons) => {
  Ajax.jsonpNew(url, params, callback, addons || {})
}

const $postCp = function(url, params, callback, addons) {
  Ajax.postNew('/postAssessment/post', Object.assign({}, {
    postAssessmentUrl: window.ConfigNew.jdcpIP + url,
  }, params), callback, addons || {})
}

const $postOp = function(url, params, callback, addons) {
  Ajax.postNew(url, params, callback, Object.assign({}, {
    serverUrl: window.ConfigNew.opPath
  }, addons || {}))
}

export default {
  init: improtVue,
  writeLog: function(data) {
    return $postOp(Api.writeLog, Util.writeLogParams(data))
  },
  sso: function(callback) {
    return $post(Api.sso, {}, callback)
  },
  getPromotion: function(callback) {
    return $get(Api.getPromotion, {}, callback)
  },
  readPromotion: function(data, callback) {
    return $post(Api.readPromotion, data, callback)
  },
  checkNewTask: function(data, callback) { // 新作业新测评
    return $get(Api.checkNewTask, data, callback)
  },
  // 信息确认
  savePartnerInfo: function(data, callback) {
    return $post(Api.savePartnerInfo, data, callback)
  },
  addOneFeedback: function(data, callback) {
    return $post(Api.addOneFeedback, data, callback)
  },
  login: function(data, callback, addons) {
    return $post(Api.login, data, callback, addons)
  },
  logout: function(callback, addons) {
    return $post(Api.logout, {}, callback, addons)
  },
  sendMsg: function(data, callback) {
    return $post(Api.sendMsg, data, callback)
  },
  register: function(data, callback) {
    return $post(Api.register, data, callback)
  },
  rGetRegion: function(data, callback) {
    return $jsonp(Api.rGetRegion, data, callback)
  },
  rGetSchool: function(data, callback) {
    return $jsonp(Api.rGetSchool, data, callback)
  },
  rGetClass: function(data, callback) {
    return $jsonp(Api.rGetClass, data, callback)
  },
  perfect: function(data, callback) {
    return $postCp(Api.perfect, data, callback)
  },
  fpSendMsg: function(data, callback) {
    return $post(Api.fpSendMsg, data, callback)
  },
  fpGetVerify: function(data, callback) {
    return $post(Api.fpGetVerify, data, callback)
  },
  fpResetPwd: function(data, callback) {
    return $post(Api.fpResetPwd, data, callback)
  },
  getTodoBanner: function(data, callback) {
    return $post(Api.getTodoBanner, data, callback)
  },
  getTodoList: function(data, callback) {
    return $post(Api.getTodoList, data, callback)
  },
  getCompetitionDetail: function(data, callback) {
    return $get(Api.getCompetitionDetail, data, callback)
  },
  getCompetitionRanking: function(callback) {
    return $get(Api.getCompetitionRanking, {}, callback)
  },
  payInfo: function(data, callback) {
    return $post(Api.payInfo, data, callback)
  },
  checkPay: function(data, callback) {
    return $post(Api.checkPay, data, callback)
  },
  speakingStar: function(callback) {
    return $get(Api.getThisWeekRank, {}, callback)
  },
  classVoice: function(callback) {
    return $get(Api.getLastWeekRank, {}, callback)
  },
  getSubmitLog: function(data, callback) {
    return $get(Api.getSubmitLog, data, callback)
  },
  getLowScoreZy: function(data, callback) {
    return $post(Api.getLowScoreZy, data, callback)
  },
  addLowScore: function(data, callback) {
    return $post(Api.addLowScore, data, callback)
  },
  deleLowScore: function(data, callback) {
    return $post(Api.deleLowScore, data, callback)
  },
  getLowScoreCp: function(data, callback) {
    return $postCp(Api.getLowScoreCp, data, callback)
  },
  delLowScore: function(data, callback) {
    return $post(Api.delLowScore, data, callback)
  },
  getVocabList: function(data, callback) {
    return $post(Api.getVocabList, data, callback)
  },
  insertOneVocab: function(data, callback) {
    return $post(Api.insertOneVocab, data, callback)
  },
  deleteOneVocab: function(data, callback) {
    return $post(Api.deleteOneVocab, data, callback)
  },
  getCollectionsList: function(data, callback) {
    return $postCp(Api.getCollectionsList, data, callback)
  },
  addCollections: function(data, callback) {
    return $postCp(Api.addCollections, data, callback)
  },
  deleCollections: function(data, callback) {
    return $postCp(Api.deleCollections, data, callback)
  },
  ybxxList: function(callback) {
    return $post(Api.ybxxList, {}, callback)
  },
  tsksList: function(data, callback) {
    return $jsonp(Api.tsksList, data, callback)
  },
  zxxlCatgList: function(callback) {
    return $jsonp(Api.zxxlCatgList, {}, callback)
  },
  zxxlList: function(data, callback) {
    return $jsonp(Api.zxxlList, data, callback)
  },
  htxmList: function(data, callback) {
    return $jsonp(Api.htxmList, data, callback)
  },
  stsList: function(data, callback) {
    return $jsonp(Api.stsList, data, callback)
  },
  cjzwList: function(data, callback) {
    return $jsonp(Api.cjzwList, data, callback)
  },
  getStuBook: function(data, callback) {
    return $get(Api.getStuBook, data, callback)
  },
  getContent: function(data, callback) {
    return $get(Api.getContent, data, callback)
  },
  getSearchCond: function(data, callback) {
    return $get(Api.getSearchCond, data, callback)
  },
  getBookList: function(data, callback) {
    return $get(Api.getBookList, data, callback)
  },
  bindStuBook: function(data, callback) {
    return $post(Api.bindStuBook, data, callback)
  },
  unbindStuBook: function(data, callback) {
    return $post(Api.unbindStuBook, data, callback)
  },
  addSelfLearn: function(data, callback) {
    return $post(Api.addSelfLearn, data, callback)
  },
  // 学习记录
  unreadNotice: function(data, callback) {
    return $jsonp(Api.unreadNotice, data, callback)
  },
  getNoticeList: function(data, callback) {
    return $jsonp(Api.stsList, data, callback)
  },
  readAllNotice: function(data, callback) {
    return $jsonp(Api.stsList, data, callback)
  },
  getOneNotice: function(data, callback) {
    return $jsonp(Api.stsList, data, callback)
  },
  // 个人中心
  readDevice: function(callback) {
    return $get(Api.readDevice, {}, callback)
  },
  writeDevice: function(data, callback) {
    return $post(Api.writeDevice, data, callback)
  },
  preload: function(data) {
    return $postCp(Api.preload, data)
  },
  getCompetitionInfo: function(data, callback) {
    return $jsonp(Api.getCompetitionInfo, data, callback)
  },
  getPaperInfo: function(data, callback) {
    return $jsonp(Api.getPaperInfo, data, callback)
  },
  checkUserBehavior: function(data, callback) {
    return $get(Api.checkUserBehavior, data, callback)
  },
  setUserBehavior: function(data) {
    return $get(Api.setUserBehavior, data)
  },
  savePaperAnswer: function(data, callback) {
    return $post(Api.savePaperAnswer, data, callback)
  },
  getPaperAnswer: function(data, callback) {
    return $post(Api.getPaperAnswer, data, callback)
  },
  delePaperAnswer: function(data, callback) {
    return $post(Api.delePaperAnswer, data, callback)
  },
  submitPaperAnswer: function(data, callback, addons) {
    return $postCp(Api.submitPaperAnswer, data, callback, addons)
  },
  startCompetition: function(data) {
    return $postCp(Api.startCompetition, data)
  },
  lowScorePractice: function(data, callback) {
    return $postCp(Api.lowScorePractice, data, callback)
  },
  collectionsPractice: function(data, callback) {
    return $postCp(Api.collectionsPractice, data, callback)
  },
  cjzwListExam: function(data, callback) {
    return $jsonp(Api.cjzwListExam, data, callback)
  },
  checkIsCollection: function(data, callback) {
    return $postCp(Api.checkIsCollection, data, callback)
  },
  setPromoteNoticeReaded: function(callback) {
    return $post(Api.setPromoteNoticeReaded, {}, callback)
  },
}
