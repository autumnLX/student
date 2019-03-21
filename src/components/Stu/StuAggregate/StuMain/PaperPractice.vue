<template lang="pug">
  #Paper
    ul.renderLoading(v-if="bookPracticeNonEmpty")
      li
        i.loading
        span 正在加载..
    div.paperPratice(v-else-if="paperPraticeList.length")
      p.count.grey9 {{$t('Stu.lowScore.count')}}
        span.green  {{ paperPraticeCount }} 
        | {{$t('Stu.lowScore.topic')}}
      div
        div.topic-practice(v-for='(o, idx) of paperPraticeList' :class='{expand: o.expand}')
          div.info-bar
            div
              span.a.grey6.f14 {{ idx + 1 + (currentPage -1) * 10}}. {{o.name}}
              span.b.grey9.f12 {{$t('Stu.lowScore.ability')}}：{{o.topic_ability}}
              span.b.grey9.f12 {{$t('Stu.lowScore.knowledge')}}：
              span.b.grey9.f12 {{$t('Stu.lowScore.difficulty')}}：
                Star(:level='o.difficulty_level')
            div
              i.icon-common2.icon-collect(:class='{collection: o.isCollection == 1}' @click='collectionCP(o, idx)')
              i.icon-common2.icon-trash(@click='deletComfirmCp(o.topic_id, o.sub_topic)')
          div.content-block
            Topic(
              :topicParam='o' 
              :player='player' 
              :doPlay='doPlay' 
              :currentId='currentIdx' 
              :getCurrentId='getCurrentId'
            )
            div.toolbar
              span.green(@click='handlePaperPracticeToggle(idx)' v-if='o.expand') {{$t('Stu.lowScore.expand')}}
                i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
              span.green(@click='handlePaperPracticeToggle(idx)' v-else) {{$t('Stu.lowScore.detail')}}
                i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
              button.btn.btn-sm.btn-green(@click='toPractice(idx)') {{$t('Stu.lowScore.practice')}}
    div.empty(v-else)
      i.emptyIcon
      span.f16.greyc {{$t('Stu.lowScore.empty')}}
    DiaLog(:dialogConfig='dialogConfig' :isShowDialog='false' ref='dialogParam')
    Pagination(v-if='!bookPracticeNonEmpty && paperPraticeList.length' :currentPage='currentPage' :maxNumPage='maxNumPage' :getSkipPage='getSkipPage')
</template>

<script>
import Topic from '@/components/Stu/topic'
import DiaLog from '@/UIO/DiaLog/App'
export default {
  name: 'PaperPractice',
  components: Object.assign({}, { Topic, DiaLog }),
  data() {
    return {
      dialogConfig: {
        getCurrentPage: 'common', // 获取弹框的类型
        needCancleIcon: true, // 是否需要右上角的关闭按钮
        needLogin: true, // 是否显示登录
        confirmBtnText: '确认', // 确认弹框文案
        cancleBtnText: '取消', // 取消按钮文案
        cancleBtnStyle: 'btn-white', // 取消按钮风格
        confirmBtnStyle: 'btn-red',
        showAssistTitleText: '确定要删除该试题？',
        assistTitleStyle: 'big',
        showBigTileFlag: false,
        titleIcon: 'warning',
        isNONTipAgain: true, // 是否需要不在提醒功能
        cancleBtnCallBack: () => { },
        confirmBtnCallBack: () => { // 确认按钮回调
          this.deletLowScoreCp()
        }
      },
      bookPracticeNonEmpty: false,
      paperPraticeList: [],
      paperPraticeCount: 0,
      currentDeleteId: 0,
      subTopic: 0,
      isNeedDeleteTip: true, // 是否需要删除弹框
      player: this.$store.state.$player,
      currentIdx: '',
      // 分页
      currentPage: 1,
      maxNumPage: 1,
    }
  },
  methods: {
    getSkipPage(page) {
      this.currentPage = page
    },
    getCurrentId(id) {
      this.currentIdx = id
    },
    handlePaperPracticeToggle(n) {
      const o = this.paperPraticeList[n]
      o.expand = !o.expand
      this.paperPraticeList.splice(n, 1, o)
    },
    toPractice(idx) {
      let _path = this.$route.path + '?isPaper=1'
      _path = _path.replace(/\?/g, '{{q}}').replace(/&/g, '{{a}}')
      this.$router.push({
        name: 'exam',
        query: {
          idx,
          page: this.currentPage,
          from: '1',
          fromUrl: encodeURIComponent(_path)
        }
      })
    },
    doPlay(audioUrl, callback = function () { }) {
      this.player.load({
        url: audioUrl,
        success: () => {
          this.player.play({
            onStart: () => {},
            onStop: () => {
              callback()
            }
          })
        }
      })
    },
    deletComfirmCp(id, subTopic) {
      this.currentDeleteId = id
      this.subTopic = subTopic
      if (this.isNeedDeleteTip) {
        this.$refs.dialogParam.showDialogFlag = true
      } else {
        this.$refs.dialogParam.showDialogFlag = false
        this.deletLowScoreCp()
      }
    },
    deletLowScoreCp() {
      if (this.currentPage > 1 && this.paperPraticeList.length === 1) { // 当前非第一页最后一条数据删除
        this.currentPage = this.currentPage - 1
      }
      this.$ajax.post('/postAssessment/post', {
        postAssessmentUrl: `${this.$config.jdcpIP}/api/CollectLowScore/deleLowScore`,
        topicId: this.currentDeleteId,
        subTopic: this.subTopic
      }, (res) => {
        if (res.status === 1) {
          if (this.$refs.dialogParam.selectActiveFlag) {
            this.$ajax.post('/students/addCustomTagAlert', {
              tag: 'cp_low_score'
            }, (res) => {
              if (res.status === 1) {
                this.checkCustomTagAlert('cp_low_score')
              }
            })
          } else {
            this.checkCustomTagAlert('cp_low_score')
          }
        }
      })
    },
    checkCustomTagAlert(type, callback) {
      this.$ajax.post('/students/checkCustomTagAlert', {
        tag: type
      }, (res) => {
        if (res.status === 1) {
          if (res.data === 1) {
            this.isNeedDeleteTip = false
          } else {
            this.isNeedDeleteTip = true
          }
          if (type === 'zy_low_score') {
            this.getLowScoreZYList()
          } else if (type === 'cp_low_score') {
            this.getLowScoreCPList()
          }
        }
      })
    },
    collectionCP(param, index) {
      if (param.isCollection === '1') {
        this.$ajax.post('/postAssessment/post', {
          postAssessmentUrl: this.$config.jdcpIP + '/api/CollectLowScore/deleCollections',
          topicId: param.topic_id,
          subTopic: param.sub_topic
        }, (res) => {
          if (res.status === 1) {
            this.$set(this.paperPraticeList[index], 'isCollection', '0')
            this.$toast({
              text: '已取消收藏',
              showWrap: false,
              iconFlag: false,
              duration: 1000,
              styleObj: {
                'width': '140px',
                'height': '50px',
                'border-radius': '4px',
                'background-color': 'rgba(0, 0, 0, 0.6)'
              }
            })
          } else if (res.status === 2) {
            window.location.href = '/login'
          }
        })
      } else if (param.isCollection === '0') {
        this.$ajax.post('/postAssessment/post', {
          postAssessmentUrl: this.$config.jdcpIP + '/api/CollectLowScore/addCollections',
          topicId: param.topic_id,
          topicType: param.topic_type,
          subTopic: param.sub_topic
        }, (res) => {
          if (res.status === 1) {
            this.$set(this.paperPraticeList[index], 'isCollection', '1')
            this.$toast({
              text: '收藏成功',
              showWrap: false,
              duration: 1000,
              styleObj: {
                'width': '160px',
                'height': '50px',
                'border-radius': '4px',
                'background-color': '#21bd73'
              }
            })
          } else if (res.status === 2) {
            window.location.href = '/login'
          }
        })
      }
    },
    getLowScoreCPList() {
      this.paperPraticeList = []
      this.bookPracticeNonEmpty = true
      this.$ajax.post('/postAssessment/post', {
        postAssessmentUrl: `${this.$config.jdcpIP}/api/CollectLowScore/getLowScoreList`,
        currentPage: this.currentPage
      }, (res) => {
        if (res.status === 1) {
          this.bookPracticeNonEmpty = false
          this.paperPraticeList = res.data.list
          this.currentPage = res.data.pageInfo ? res.data.pageInfo.page : 1
          this.maxNumPage = res.data.pageInfo ? res.data.pageInfo.total : 1
          this.paperPraticeCount = res.data.pageInfo.count
        } else if (res.status === 2) {
          window.location.href = '/login'
        }
      })
    }
  },
  watch: {
    currentPage: function (val) {
      this.checkCustomTagAlert('cp_low_score')
    }
  },
  created() {
    if (!this.$store.state.$recorder) {
      this.$store.commit('initAiPanel')
      this.player = this.$store.state.$player
    }
  },
  mounted() {
    this.checkCustomTagAlert('cp_low_score')
  }
}
</script>

<style lang='less' scoped>
@image-base-url: "../../../../assets/image";
#Paper {
  margin-top: 10px;
  min-height: 494px;
  padding: 0 30px 40px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
}

ul.renderLoading {
  & > li {
    background: #fff;
    height: 220px;
    padding-top: 80px; 
    & > i.loading {
      display: block;
      width: 60px;
      height: 60px;
      margin: 0 auto;
      background-image: url("@{image-base-url}/stu/icon_loading.gif");
    }
    & > span {
      display: block;
      margin: 10px auto 0;
      font-size: 14px;
      color: #999;
      text-align: center;
    }
  }
}

div.paperPratice {
  & > .count {
    height: 70px;
    line-height: 70px;
  }
  .topic-practice {
    width: 890px;
    margin: 0 auto 20px;
    border: 1px solid #f8f8f8;
    border-radius: 10px;
    background-color: #f8f8f8;
    overflow: hidden;

    &.expand {
      .content-block {
        height: auto;
        transition: all 1s ease-in-out;
        -moz-transition: all 1s ease-in-out;
        -webkit-transition: all 1s ease-in-out;
        -moz-transition: all 1s ease-in-out;
      }

      .toolbar {
        position: relative !important;
        bottom: 0 !important;
        left: 0 !important;
        margin: 0 auto !important;
      }

      .content > div {
        height: auto !important;
      }
    }

    &:hover {
      border-color: #24cc7c;
    }

    .info-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      padding: 0 25px;
      border-bottom: 1px solid #eee;

      .a {
        font-weight: bold;
      }
      .b {
        padding: 0 20px;
        border-left: 1px solid #eee;
      }

      .icon-common2 {
        margin-left: 10px;
        &.collection {
          background-position-x: -160px!important;
        }
      }
    }

    .content-block {
      position: relative;
      height: 148px;
      padding: 15px 25px;

      .toolbar {
        position: absolute;
        bottom: 15px;
        left: 25px;
        width: 840px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        background: url("@{image-base-url}/stu/video/expand.png") repeat-x
          center;

        span {
          cursor: pointer;
        }

        .icon-common {
          margin-left: 10px;
          vertical-align: middle;
        }

        .btn {
          position: absolute;
          top: 0;
          right: 0;
        }
      }
    }
  }
}
.icon-trash {
  &.white {
    background-position-x: -120px;
  }
  &.white:hover {
    background-position-x: -100px;
  }
}
.empty {
  width: 300px;
  height: 454px;
  text-align: center;
  margin: 0 auto;
  padding-top: 50px;
  position: relative;

  i {
    display: block;
    width: 300px;
    height: 300px;
    background: url("@{image-base-url}/common/pic_empty-05.png") no-repeat
      center;
  }

  span {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 150px;
  }
}
</style>