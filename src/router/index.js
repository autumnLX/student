import Vue from 'vue'
import Router from 'vue-router'
// 静态页面
import Payment from '@/components/PaymentAgreement' // 付费协议
// 业务模块
const Stu = () => import('@/components/Stu/App') // 学生入口
const StuMain = () => import('@/components/Stu/StuMain/App') // 首页 框
const StuIndex = () => import('@/components/Stu/StuIndex/App') // 首页
const StuExamDetail = () => import('@/components/Stu/StuExamDetail/App') // 测评详情
const StuDetection = () => import('@/components/Stu/StuDetection/App') // 设备检测
const StuPractice = () => import('@/components/Stu/StuPractice/App') // 测评 作业
const StuWork = () => import('@/components/Stu/StuPractice/StuWork/App') // 作业
const StuTask = () => import('@/components/Stu/StuPractice/StuTask/App') // 非VIP作业
const StuExam = () => import('@/components/Stu/StuPractice/StuExam/App') // 测评
const StuAggregate = () => import('@/components/Stu/StuAggregate/App') // 低分集
const StuAggregateMain = () => import('@/components/Stu/StuAggregate/StuMain/App') // 低分集
const StuCollection = () => import('@/components/Stu/StuCollection/App') // 收藏本
const StuCollectionMain = () => import('@/components/Stu/StuCollection/StuMain/App') // 收藏本
const StuPhonetics = () => import('@/components/Stu/StuPhonetics/App') // 音标学习
const StuTSKS = () => import('@/components/Stu/StuTSKS/App') // 听说考试
const StuSpecial = () => import('@/components/Stu/StuSpecial/App') // 专项训练
const StuTopics = () => import('@/components/Stu/StuTopics/App') // 话题项目
const StuSTS = () => import('@/components/Stu/StuSTS/App') // 视听说
const StuDialogue = () => import('@/components/Stu/StuDialogue/App') // 情景对话
const StuComposition = () => import('@/components/Stu/StuComposition/App') // 口头作文
const StuTrends = () => import('@/components/Stu/StuTrends/App') // 班级动态
const StuSync = () => import('@/components/Stu/StuSync/App') // 同步练习
const StuRecord = () => import('@/components/Stu/StuRecord/App') // 学习记录
const StuBible = () => import('@/components/Stu/StuBible/App') // 听说宝典列表
const StuBibleDetail = () => import('@/components/Stu/StuBible/Detail') // 听说宝典详情
const StuMsgCenter = () => import('@/components/Stu/StuMsgCenter/App') // 消息中心列表
const StuMsgDetail = () => import('@/components/Stu/StuMsgCenter/Detail') // 消息中心详细
const StuOwnInfo = () => import('@/components/Stu/StuOwnInfo/App') // 个人资料
const StuHelp = () => import('@/components/Stu/StuHelp/App') // 在线帮助
const ExamPaper = () => import('@/components/Stu/StuExamPaper/App') // 自学试卷包
Vue.use(Router)
export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [{
    path: '/phonetics',
    name: 'Phonetics',
    component: StuPhonetics
  }, {
    path: '/detection',
    name: 'detection',
    component: StuDetection,
  }, {
    path: '/practice',
    name: 'practice',
    component: StuPractice,
    children: [
      { path: 'work', name: 'work', component: StuWork },
      { path: 'task', name: 'task', component: StuTask },
      { path: 'exam', name: 'exam', component: StuExam },
    ]
  }, {
    path: '/stu',
    component: Stu,
    children: [
      { path: '', redirect: 'home' },
      {
        path: 'home',
        component: StuMain,
        children: [
          { path: '', redirect: 'index' },
          { path: 'index', name: 'stuIndex', component: StuIndex },
          { path: 'examDetail', name: 'stuExamDetail', component: StuExamDetail },
          {
            path: 'aggregate',
            name: 'stuAggregate',
            component: StuAggregate,
            children: [
              { path: 'StuAggregateMain', name: 'StuAggregateMain', component: StuAggregateMain }
            ]
          },
          {
            path: 'collection',
            name: 'stuCollection',
            component: StuCollection,
            children: [
              { path: 'StuCollectionMain', name: 'StuCollectionMain', component: StuCollectionMain }
            ]
          },
          { path: 'tsks', name: 'stuTSKS', component: StuTSKS },
          { path: 'special', name: 'stuSpecial', component: StuSpecial },
          { path: 'topics', name: 'stuTopics', component: StuTopics },
          { path: 'sts', name: 'stuSTS', component: StuSTS },
          { path: 'dialogue', name: 'stuDialogue', component: StuDialogue },
          { path: 'composition', name: 'stuComposition', component: StuComposition },
          { path: 'trends', name: 'stuTrends', component: StuTrends },
        ]
      }, {
        path: 'sync',
        name: 'stuSync',
        component: StuSync,
      }, {
        path: 'record',
        name: 'stuRecord',
        component: StuRecord,
      }, {
        path: 'bible',
        name: 'stuBible',
        component: StuBible,
      },
      { path: 'bible/detail/:id', name: 'stuBibleDetail', component: StuBibleDetail },
      { path: 'msgCenter', name: 'stuMsgCenter', component: StuMsgCenter },
      { path: 'msgCenter/detail', name: 'stuMsgDetail', component: StuMsgDetail },
      { path: 'ownInfo', name: 'stuOwnInfo', component: StuOwnInfo },
      { path: 'help', name: 'stuHelp', component: StuHelp },
      { path: 'examPaper', name: 'ExamPaper', component: ExamPaper },
    ]
  }, {
    path: '/payment',
    name: 'payment',
    component: Payment
  }]
})
