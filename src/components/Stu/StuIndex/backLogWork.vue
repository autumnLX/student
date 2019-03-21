<template lang="pug">
  div#BackLogWork
    div.flex-center-center(v-if='status_ === "loading"' style='height: 310px;')
      loading
    template(v-else)
      //- eg: 当前作业x个
      p.total.f14.grey9 {{$t('Stu.backlogList.total')}}
        span.green(style='font-weight: bold;') &nbsp;{{tableWorkCount + bannerListCount}}&nbsp;
        span.f14.grey9 {{$t('Stu.backlogList.workcount')}}
      //- Banner
      BannerList(:bannerWorkList='bannerWorkList')
      div.line(v-if='!bannerListCount')
      //- List
      div(v-if='(tableWorkList.length + bannerListCount)')
        //- 当banner没有内容且列表仅有1条数据的时候
        div(v-if='tableWorkList.length === 1 && bannerListCount === 0')
          div.list
            img.standardIcon(v-if='tableWorkList[0].nonBookCover' :class="handleImage(tableWorkList[0])" :src='tableWorkList[0].bookCover' alt='')
            i.standardIcon(v-else :class="handleImage(tableWorkList[0])")
            div.center(:class="{samll: tableWorkList[0].type === 'competition' && tableWorkList[0].prcStatus === '1'}")
              p.f16.grey6 
                i.icon-oral(v-if="tableWorkList[0].type === 'workset' && tableWorkList[0].prcStatus === '2'" title='大家都在做')
                span.f16.grey6 {{tableWorkList[0].name}}
              p.f14.grey9 {{tableWorkList[0].dateTip}}
            dl.score.f16.green {{tableWorkList[0].score}}
            button.startWorkBtn(v-if="tableWorkList[0].btnStatus === 'practice'" :class="{disabled: !tableWorkList[0].isPrcBtnValid}"  @click="startWork(tableWorkList[0])") {{$t('Stu.backlogList.btn.startwork')}}
            button.startWorkBtn(v-else-if="tableWorkList[0].btnStatus === 'view'" :class="{disabled: !tableWorkList[0].isPrcBtnValid}" @click="startWork(tableWorkList[0])") {{$t('Stu.backlogList.btn.viewDetail')}}
          div.empty2
            button.completeWork(@click='viewCompleteWork()') {{$t('Stu.backlogList.btn.viewComplete')}} &gt;&gt;
        div(v-else)
          div(v-if='tableWorkList.length > 0')
            div.list(v-for='tab in tableWorkList')
              img.standardIcon(v-if='tab.nonBookCover' :class="handleImage(tab)" :src="tab.bookCover " alt='')
              i.standardIcon(v-else :class="handleImage(tab)")
              div.center(:class="{samll: tab.type === 'competition' && tab.prcStatus === '1'}")
                p.f16.grey6(:title='tab.name') 
                  i.icon-oral(v-if="tab.type === 'workset' && tab.prcStatus === '2'" title='大家都在做')
                  span.f16.grey6 {{tab.name}}
                p.f14.grey9 {{tab.dateTip}}
              dl.score.f16.green {{tab.score}}
              button.startWorkBtn(v-if="tab.btnStatus === 'practice'" :class="{disabled: !tab.isPrcBtnValid}" @click="startWork(tab)") {{$t('Stu.backlogList.btn.startwork')}}
              button.startWorkBtn(v-else-if="tab.btnStatus === 'view'" :class="{disabled: !tab.isPrcBtnValid}" @click="startWork(tab)") {{$t('Stu.backlogList.btn.viewDetail')}}
          div.view
            button.viewMore(v-if='showViewMoreFlag' @click='viewMoreWork()') {{$t('Stu.backlogList.btn.viewMore')}}
            button.completeWork(:class="{marginTop: showViewMoreFlag}" @click='viewCompleteWork()') {{$t('Stu.backlogList.btn.viewComplete')}} &gt;&gt;    
      //- 空列表
      div(class='empty' v-else)
        p {{$t('Stu.backlogList.nonwork')}}
        p {{$t('Stu.backlogList.recommend')}}~
        button.completeWork(@click='viewCompleteWork()') {{$t('Stu.backlogList.btn.viewComplete')}} &gt;&gt;
</template>
 
<script>
import BannerList from './bannerList'
import DiaLog from '@/UIO/DiaLog/App'

export default {
  name: 'BackLogWork',
  components: Object.assign({}, { BannerList, DiaLog }),
  data() {
    return {
      status_: 'loading', // 组件状态
      showdialog: true,
      bannerWorkList: [],
      bannerListCount: 0,
      tableWorkList: [],
      tableWorkCount: 0,
      showViewMoreFlag: false,
      currentPage: 1,
      currentUrl: '',
      currentStageId: '',
    }
  },
  methods: {
    isAllFetched() {
      this.fetchCount -= 1
      if (this.fetchCount <= 0) {
        this.status_ = 'done'
      }
    },
    // getBannerCount(count) {
    //   this.bannerListCount = count
    //   this.isAllFetched()
    // },
    handleImage(param) {
      let imgUrl = ''
      if (param.type === 'competition') {
        if (param.prcStatus === '1') {
          if (param.bookCover) {
            imgUrl = 'large'
          } else {
            imgUrl = 'greenCover large'
          }
        } else if (param.prcStatus === '2' || param.prcStatus === '3') {
          imgUrl = 'greenCover'
        } else {
          imgUrl = 'greenCover'
        }
      } else if (param.type === 'workset') {
        if (param.prcStatus === '3') {
          imgUrl = 'yellowCover'
        } else {
          imgUrl = 'greenCover'
        }
      }
      return imgUrl
    },
    getTodoBannerPractice() { // 获取banner里面的数据
      this.$ajax.post('/practices/getTodoBannerPractice', {}, (res) => {
        if (res.status === 1) {
          this.bannerWorkList = res.data.list
          this.bannerWorkList.forEach((value, index) => {
            if (value.type === 'competition') {
              this.bannerWorkList[index].bookCover = this.$config.resUrl + value.bookCover
            }
          })
          // this.getBannerCount(res.data.pageInfo.total)
          this.bannerListCount = res.data.pageInfo.total

          this.isAllFetched()
        }
      })
    },
    getAllTodoPractice() { // 获取列表里面的作业
      this.$ajax.post('/practices/getAllTodoPractice', {
        page: this.currentPage,
        rows: 10
      }, (res) => {
        if (res.status === 1) {
          this.tableWorkList = this.tableWorkList.concat([], res.data.list)
          this.tableWorkList.forEach((value, index) => {
            if (value.bookCover) {
              this.tableWorkList[index].nonBookCover = true
              if (!(value.bookCover.indexOf('http://') >= 0 || value.bookCover.indexOf('https://') >= 0)) {
                this.tableWorkList[index].bookCover = this.$config.resUrl + value.bookCover
              }
            } else {
              this.tableWorkList[index].nonBookCover = false
            }
          })
          this.tableWorkCount = res.data.pageInfo.total
          this.currentPage = JSON.parse(res.data.pageInfo.page)
          if (res.data.pageInfo.total - this.currentPage * 10 > 0) {
            this.showViewMoreFlag = true
          } else {
            this.showViewMoreFlag = false
          }

          this.isAllFetched()
        }
      })
    },
    viewMoreWork() {
      this.getAllTodoPractice(++this.currentPage)
    },
    startWork(param) {
      if (!param.isPrcBtnValid) {
        return false
      }
      let prcParam = param.practiceParam
      if (param.btnStatus === 'practice') { // 练习
        if (param.type === 'workset') { // 作业
          if (this.$store.state.isVIP) { // VIP
            window.location.href = `/practice/work?isTask=${prcParam.isTask}&worksetId=${prcParam.worksetId}&layerId=${prcParam.layerId}&layerType=${prcParam.layerType}&categoryId=${prcParam.categoryId}&teacherId=${prcParam.teacherId}&pathname=stuIndex`
          } else {
            window.location.href = `/practice/task?isTask=${prcParam.isTask}&worksetId=${prcParam.worksetId}&layerId=${prcParam.layerId}&layerType=${prcParam.layerType}&categoryId=${prcParam.categoryId}&teacherId=${prcParam.teacherId}&pathname=stuIndex`
          }
        } else if (param.type === 'competition') { // 测评
          this.currentUrl = '/practice/exam?competitionId=' + prcParam.competitionId + '&groupId=' + prcParam.groupId + '&stageId=' + prcParam.stageId + '&checkdevice=1'
          this.currentStageId = prcParam.stageId
          if (param.needSignUp) {
            this.$ajax.postNew('/postAssessment/post', {
              postAssessmentUrl: this.$config.jdcpIP + '/api/WebCompetition/setJoinTime',
              stage_id: prcParam.stageId,
              data: {}
            }, (res) => {
              if (res.status === 2) { // 登录超时
                window.location.href = window.ConfigNew.login
              } else if (res.status === 2001) { // 权限错误
                window.location.href = window.ConfigNew.login
              } else if (res.status === 1 || res.status === 4301) {
                window.location.href = this.currentUrl
              } else {
                this.$store.commit('showErrDialog', {
                  errText: res.info,
                  btnText: this.$t('dialog.iknow'),
                  cancleBtnCallBack: () => {
                    location.reload()
                  }
                })
              }
            }, {
              notNeedStatus: true
            })
          } else {
            window.location.href = this.currentUrl
          }
        }
      } else if (param.btnStatus === 'view') { // 查看
        if (param.prcStatus && param.prcStatus === '2') {
          this.$router.push({ path: '/stu/examPaper', query: { competitionId: prcParam.competitionId, groupId: prcParam.groupId, stageId: prcParam.stageId } })
        } else {
          this.$router.push({ name: 'stuExamDetail', query: { competitionId: param.id } })
        }
      }
    },
    viewCompleteWork() {
      this.$router.push('/stu/record')
    }
  },
  created() {
    this.fetchCount = 2
  },
  mounted() {
    this.getTodoBannerPractice()
    this.getAllTodoPractice()
  }
}
</script>

<style lang='less'>
@image-base-url: "../../../assets/image";
#BackLogWork {
  margin: 0 30px;
  padding: 10px 0 30px 0;

  & > .total {
    height: 50px;
    line-height: 50px;
  }

  div.list {
    padding: 15px 0;
    height: 110px;
    position: relative;
    border-bottom: 1px solid #eeeff6;

    & > img {
      float: left;
      display: block;
      width: 60px;
      height: 80px;
      overflow: hidden;
      border-radius: 4px;
    }

    & > i {
      float: left;
      display: block;
      width: 60px;
      height: 80px;
      overflow: hidden;
      border-radius: 4px;

      &.greenCover {
        background: url("@{image-base-url}/stu/index/work_cover_green.png")
          no-repeat center;
      }
      &.yellowCover {
        background: url("@{image-base-url}/stu/index/work_cover_yellow.png")
          no-repeat center;
      }
    }

    & > .large {
      width: 160px;
      height: 80px;
    }

    & > .center {
      float: left;
      width: 420px;
      padding: 9px 0 0 20px;

      & > p:first-child {
        height: 30px;
        line-height: 30px;
        width: 93%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        i.icon-oral {
          display: inline-block;
          width: 20px;
          height: 20px;
          line-height: 20px;
          margin-right: 10px;
          background: url("@{image-base-url}/stu/icon_oral.png") no-repeat
            center;
          position: relative;
          top: 5px;
        }
      }

      & > p:last-child {
        height: 24px;
        line-height: 24px;
      }
    }

    & > .samll {
      width: 320px;
    }

    & > .score {
      position: absolute;
      top: 50%;
      right: 110px;
      width: 60px;
      height: 20px;
      line-height: 20px;
      margin-top: -10px;
      text-align: center;
    }

    & > .startWorkBtn {
      position: absolute;
      top: 50%;
      right: 0;
      margin-top: -17px;
      width: 100px;
      height: 34px;
      text-align: center;
      line-height: 34px;
      border-radius: 17px;
      font-size: 16px;
      color: #fff;
      background: #24cc7c;
      cursor: pointer;
      overflow: hidden;
      outline: none;
      border: none;
      &:hover {
        background: #21bd73;
      }
      &.disabled {
        background: #eee;
        color: #ccc;
        cursor: not-allowed;
      }
    }
  }

  div.line {
    width: 620px;
    height: 1px;
    background: #eeeff6;
    margin: 10px 0 15px 0;
  }

  div.view {
    position: relative;
    text-align: center;
  }

  div.empty {
    height: 310px;
    position: relative;
    background: url("@{image-base-url}/stu/icon_empty1.png") no-repeat center;
    background-size: cover;

    & > p {
      margin: 0 auto;
      font-size: 16px;
      color: #fff;
      line-height: 24px;
      text-align: center;
    }

    & > p:first-child {
      padding-top: 90px;
    }

    & > .completeWork {
      position: absolute;
      left: 50%;
      bottom: 30px;
      margin: 0;
      margin-left: -80px;
    }
  }

  div.empty2 {
    position: relative;
    height: 160px;
    background: url("@{image-base-url}/stu/icon_empty2.png") no-repeat center;
    background-size: cover;
  }

  .completeWork {
    display: block;
    margin: 30px auto 0;
    width: 180px;
    height: 34px;
    text-align: center;
    line-height: 34px;
    border-radius: 17px;
    font-size: 16px;
    color: #fff;
    background: #24cc7c;
    cursor: pointer;
    overflow: hidden;
    outline: none;
    border: none;
  }

  .marginTop {
    margin: 20px auto 0;
  }

  button.completeWork:hover {
    background: #21bd73;
  }

  button.viewMore {
    display: block;
    margin: 30px auto 0;
    width: 160px;
    height: 34px;
    text-align: center;
    line-height: 32px;
    border-radius: 17px;
    font-size: 14px;
    border: 1px solid #21bd73;
    background: #fff;
    color: #21bd73;
    overflow: hidden;
    cursor: pointer;
    outline: none;
  }
}
</style>