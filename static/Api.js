export default {
  writeLog: '/Push/WriteLog', // 埋点
  sso: '/passport/loginHeart', // 单点登录
  getPromotion: '/promotions/getPromotionNoticeByStuId', // 晋级列表
  readPromotion: '/promotions/setPmnReaded', // 设置晋级弹窗已读
  checkNewTask: '/StudentMessage/newTaskCompetition', // 新作业新测评
  // 信息确认
  savePartnerInfo: '/posts/savePartnerInfo', // 关于我们 - 提交信息
  addOneFeedback: '/feedbacks/addOneFeedback', // 侧边栏 - 意见反馈
  login: '/menus/unifyLogin', // 登录
  logout: '/students/logout', // 登出
  sendMsg: '/FrontendStudents/sendMessage', // 注册 - 获取验证码
  register: '/FrontendStudents/register', // 注册
  rGetRegion: '/Student/getRegion', // 获取省市区
  rGetSchool: '/webCompetition/getSchoolInfoByCity', // 获取学校
  rGetClass: '/Student/getClassInfoBySchool', // 获取年级班级
  perfect: 'WebCompetition/saveStuInfo', // 完善信息
  fpSendMsg: '/FrontendStudents/sendMessageOfPassword', // 找回密码 - 获取验证码
  fpGetVerify: '/FrontendStudents/verifyNum', // 找回密码 - 校验验证码
  fpResetPwd: '/FrontendStudents/getBackPassword', // 找回密码 - 重置密码
  getTodoBanner: '/practices/getTodoBannerPractice', // 首页 - 待完成大赛列表 banner
  getTodoList: '/practices/getAllTodoPractice', // 首页 - 待完成作业列表
  getCompetitionDetail: '/englishCompetitions/getCompetitionDetail', // 测评详情
  getCompetitionRanking: '/englishCompetitions/ranking', // 测评排名
  payInfo: '/jdcp/payInfoNew', // 支付信息
  checkPay: '/jdcp/checkPaymentStatusNew', // 检查支付
  speakingStar: '/practices/getThisWeekRank', // 首页 - 口语之星
  classVoice: '/practices/getLastWeekRank', // 首页 - 班级好声音
  getSubmitLog: '/practices/getSubmitLog', // 班级动态
  getLowScoreZy: '/wrongs/getLowScoreList', // 低分集列表 - 作业
  addLowScore: '/wrongs/addLowScore', // 加入低分集 - 作业
  deleLowScore: '/wrongs/deleLowScore', // 删除低分集 - 作业
  getLowScoreCp: '/CollectLowScore/getLowScoreList', // 低分集列表 - 测评
  delLowScore: '/CollectLowScore/deleLowScore', // 删除低分集 - 测评
  getVocabList: '/vocabs/getVocabList', // 收藏集列表 - 作业
  insertOneVocab: '/vocabs/insertOneVocab', // 加入收藏集 - 作业
  deleteOneVocab: '/vocabs/deleteOneVocab', // 删除收藏集 - 作业
  getCollectionsList: '/CollectLowScore/getCollectionsList', // 收藏集列表 - 测评
  addCollections: '/CollectLowScore/addCollections', // 加入收藏集 - 测评
  deleCollections: '/CollectLowScore/deleCollections', // 删除收藏集 - 测评
  ybxxList: '/SymbolStudy/getList', // 音标学习列表
  tsksList: '/lst_tsks/index', // 听说考试列表
  zxxlCatgList: '/lst_zxxl/index', // 专项训练分类列表
  zxxlList: '/lst_zxxl/dictCatgList', // 专项训练列表
  htxmList: '/lst_htxm/index', // 话题项目列表 话题项目测评获取题目
  stsList: '/es_sts/index', // 视听说列表 视听说测评获取题目
  cjzwList: '/es_cjzw/index', // 口头作文列表
  getStuBook: '/SynPractice/getStuBook', // 同步练习 - 根据学生，获取书本和单元信息
  getContent: '/SynPractice/getContentByUnit', // 同步练习 - 根据单元获取section和内容
  getSearchCond: '/SynPractice/getSearchCond', // 同步练习 - 添加书本 - 获取筛选下拉
  getBookList: '/SynPractice/listBookForAdd', // 同步练习 - 添加书本 - 获取书本列表接口
  bindStuBook: '/SynPractice/bindStuBook', // 同步练习 - 添加书本 - 学生绑定书本
  unbindStuBook: '/SynPractice/unbindStuBook', // 同步练习 - 添加书本 - 学生删除书本
  addSelfLearn: '/self_learn_tmps/addOneSelfLearn', // 同步练习 - 添加一次自学
  // 学习记录
  unreadNotice: '/competitionsNotices/countUnreadNotice', // 未读消息数量
  getNoticeList: '/competitionsNotices/noticeList', // 消息中心 - 消息列表
  readAllNotice: 'competitionsNotices/setAllNoticeRead', // 消息中心 - 所有已读
  getOneNotice: 'competitionsNotices/getOneNotice', // 消息中心 - 获取一个消息详情
  // 个人中心
  readDevice: '/student_device/readDevice', // 设备检测 - 读取
  writeDevice: '/student_device/writeDevice', // 设备检测 - 更新
  preload: '/papers/preload', // 测评 - 音频预加载
  getCompetitionInfo: '/MEnglishCompetition/getCompetitionInfo', // 获取测评信息
  getPaperInfo: '/WebCompetition/getPaperInfo', // 获取试卷信息
  checkUserBehavior: '/UserBehavior/checkUserBehavior', // 检查用户一些行为是否要显示
  setUserBehavior: '/UserBehavior/setUserBehavior', // 设置用户行为不再弹窗（或已读）
  savePaperAnswer: '/submitCompetition/AutoSave', // 保存测评进度
  getPaperAnswer: '/submitCompetition/getAutoSave', // 获取测评进度
  delePaperAnswer: '/submitCompetition/deleAutoSave', // 删除测评进度
  submitPaperAnswer: '/SubmitCompetition/submit', // 提交试卷
  startCompetition: '/SubmitCompetition/startCompetition', // 开始测评
  lowScorePractice: '/CollectLowScore/lowScorePractice', // 低分集测评获取题目
  collectionsPractice: '/CollectLowScore/collectionsPractice', // 收藏本测评获取题目
  cjzwListExam: '/es_cjzw/indexTopicList', // 口头作文测评获取题目
  checkIsCollection: '/CollectLowScore/checkIsCollection', // 批量判定是否加入收藏
  setPromoteNoticeReaded: '/students/setPromoteNoticeReaded', // 标记升年级信息已读
}
