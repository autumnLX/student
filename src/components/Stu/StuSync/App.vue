<template lang="pug">
  #stu-sync(v-if='show && $store.state.isVIP')
    div.section.flex-center-center(v-if='status_ === "loading"' :style='{ height: loadingHeight }')
      Loading
    template(v-else)
      div.section(:style='{ "min-height": bookList.length > 0 && unitList.length > 0 ? 0 : loadingHeight }')
        div.head.section
          span 同步练习
          div.btn.btn-green(@click='toggleBooks') + 添加教材
        div.book-gallery(v-if='bookList.length > 0')
          i.icon.icon-left(:class='{disabled: bookGalleryOffset === 0}' @click='handleMoveGallery(1)')
          div.book-wrapper
            i.icon.pointer
            div.books(:style='{width: 150 * bookCount - 30 + "px", transform: "translate(" + 750 * bookGalleryOffset + "px)"}')
              div.book(v-for='(book, idx) of bookList' :class='{selected: idx === selectedBookIdx}' @click='handleSelectBook(idx, book)')
                img.superscript(v-if='book.bookType === 2' src='/static/images/stu/sync/recommend_kami.png')
                img.superscript(v-if='book.bookType === 1' src='/static/images/stu/sync/recommend_teacher.png')
                img(:src='book.imgUrl')
                div.no-book-cover(v-if='!book.hasBookCover') {{ book.bookName }}
                div.valid.white(v-if='!book.isValid') {{$t('Stu.StuSync.notValid')}}
          i.icon.icon-right(:class='{disabled: Math.abs(bookGalleryOffset) >= Math.ceil(bookCount / 5) - 1}' @click='handleMoveGallery(-1)')
          div.selected-book-tag(:style='{left: selectedBookIdx % 5 * 150 + 153 + "px", display: showSelectedBookArrow ? "block" : "none"}')
        div.empty(v-if='bookList.length <= 0 || unitList.length <= 0')
          img(src='/static/images/stu/sync/pic_empty-02.png')
          p.f16.greyc.text-ct {{bookList.length <= 0 ? $t('Stu.StuSync.noBook') : $t('Stu.StuSync.noContent')}}
        div.unit-and-section(v-if='unitList.length > 0')
          div.unit-wrapper
            vue-scroll.unit
              ul
                li(v-for='(unit, idx) of unitList' @click='selectUnit(unit, idx)' :class='{active: selectedUnitIdx === idx}')
                  p.ellipsis {{ unit.unitName }}
          div.divide
          div.third-wrapper
            vue-scroll.third
              ul
                li.ellipsis(@click="selectAll" v-if='sectionList.length > 0')
                  i.icon(:class='{"active": selectIdAll.length === sectionList.length && sectionList.length > 0}')
                  span(:class='{"green": selectIdAll.length === sectionList.length && sectionList.length > 0}') All
                li(v-for="(section, idx) in sectionList" @click="checkOne(section)" :class='{"active": selectIdAll.indexOf(section) > -1}')
                  i.icon(:class='{"active": selectIdAll.indexOf(section) > -1}')
                  span {{section.sectionName}}
      div.section.homework(v-if='bookList.length > 0 && unitList.length > 0')
        Tab(:list='tab' :onChangeTab='handleChangeTab')
        //- 基础训练
        div.tab-container(v-if='activeTabIndex === 0')
          div.block-container
            Stage(v-for='(s, idx) of stage' :key='"stage" + idx' :idx='idx' :stage='s' :onClick='handleClickWork' :onClickEye='handleShowPreview')
          div.operation
            div.left
              i.icon.checkbox(:class='{ active: isCheckedAllWork }' @click='handleToggleCheckAllWork')
              span.f16.gray6 全部
            div.right
              span.f16.green 共{{detailNum}}个任务
              span.f12.gray9 预计需要{{detailTime}}分钟
              div.button.f16(:class='{disabled: detailNum === 0}' @click='goToPractice') 开始练习
        //- 拓展练习
        div.tab-container.tzlx(v-if='activeTabIndex === 1')
          p.f16.greyc 该功能正在开发中
          p.f16.greyc 即将上线哦！
      //- 预览作业
      Preview(v-if='isShowPreview' :hidePreview='handleHidePreview' :pStage='previewStage' :pData='practiceData')
      //- 编辑教材
      Books(v-if='isShowBooks' :toggleBooks='toggleBooks')
      km-dialog(:visible.sync="visible" :isCenter="true")
        span.jc_title(slot="title") 单词纠错
        div(slot='body')
          p.jc_text 单词纠音提供精确到音素级的反馈，不仅反馈哪里的音素错了，还能反馈错成什么音素了，并提供对应音素的发音器官动图和真人发音动图，帮助学生有针对性的提升。赶快试试吧~
          img.jc_img(src="/static/images/pic_german.png")
        km-button(slot="footer" :isBack="true" @click="visible=false" style="margin:0 auto") 知道了
  Vip(v-else-if='show')
</template>

<script>
import Vip from '@/UIO/Vip'
import Preview from './Preview'
import Books from './Books'
import Stage from './Stage'
import { KmDialog, KmButton } from '@/ui'

const getDefaultStage = () => {
  return [
    {
      name: '课前预习',
      checkAll: false,
      type: [
        {
          name: '单词跟读',
          type: 'word',
          disabled: true,
          selected: false,
          iconType: 'word',
          idx: 1
        }, {
          name: '句子跟读',
          type: 'sent',
          disabled: true,
          selected: false,
          iconType: 'sent',
          idx: 2
        }, {
          name: '段落跟读',
          type: 'para',
          disabled: true,
          selected: false,
          iconType: 'para',
          idx: 3
        }, {
          name: '对话跟读',
          type: 'dialog',
          disabled: true,
          selected: false,
          iconType: 'dialog',
          idx: 4
        }
      ]
    }, {
      name: '课后朗读',
      checkAll: false,
      type: [
        {
          name: '单词朗读',
          type: 'word',
          disabled: true,
          selected: false,
          iconType: 'word_2',
          idx: 1
        }, {
          name: '句子朗读',
          type: 'sent',
          disabled: true,
          selected: false,
          iconType: 'sent_2',
          idx: 2
        }, {
          name: '段落朗读',
          type: 'para',
          disabled: true,
          selected: false,
          iconType: 'para_2',
          idx: 3
        }, {
          name: '对话朗读',
          type: 'dialog',
          disabled: true,
          selected: false,
          iconType: 'dialog_2',
          idx: 4
        }
      ]
    }, {
      name: '强化训练',
      checkAll: false,
      type: [
        {
          name: '单词纠音',
          type: 'phrase',
          disabled: true,
          selected: false,
          iconType: 'phrase',
          idx: 5
        },
        {
          name: '单词听写',
          type: 'word',
          disabled: true,
          selected: false,
          iconType: 'word_3',
          idx: 1
        }
      ]
    }, {
      name: '背诵通关',
      checkAll: false,
      type: [
        {
          name: '段落背诵',
          type: 'para',
          disabled: true,
          selected: false,
          iconType: 'recite',
          idx: 3
        }
      ]
    }
  ]
}

const timeCalcs = [
  'n / 6', 'N * 2 / 3', 'n / 60', 'N * 2 / 3',
  'n / 12', 'N / 3', 'n / 120', 'N / 3',
  'n / 3',
  'n / 3',
  'n / 80'
]

export default {
  name: 'StuSync',
  components: { Preview, Books, Stage, Vip, KmDialog, KmButton },
  data () {
    return {
      show: false,
      status_: 'loading',
      loadingHeight: 'auto',
      nav: [
        {
          title: '同步练习'
        }
      ],
      tab: [
        {
          title: '基础训练',
          value: 'base',
          selected: true
        }, {
          title: '拓展练习',
          value: 'advanced'
        }
      ],
      visible: false,
      stage: getDefaultStage(),
      bookList: [],
      bookCount: 0,
      bookGalleryOffset: 0,
      selectedBookIdx: 0,
      showSelectedBookArrow: true,
      unitList: [],
      selectedUnitIdx: 0,
      sectionList: [],
      selectedSectionIdxList: [],
      activeTabIndex: 0,
      selectIdAll: [], // 已选择的三级选项
      isCheckedAll: false, // 三级列表全选
      isCheckedAllWork: false, // 全选作业
      BUInfo: { // book unit
        bookId: '',
        bookCover: '',
        unitId: '',
        unitName: '',
      },
      work: { // 作业内容详情
        word: [],
        sent: [],
        para: [],
        dialog: [],
        phrase: []
      },
      detailCount: {}, // 作业内容词句计数
      detailNum: 0,
      detailTime: 0,
      isShowPreview: false, // 是否显示预览Modal
      isShowBooks: false,
      previewStage: {},
      practiceData: [], // 预览作业数据
    }
  },
  methods: {
    doResetBookUnitSection (bookIdx) { // 初始化 book & unit & section & 作业
      this.selectedBookIdx = bookIdx
      this.showSelectedBookArrow = true
      this.BUInfo.bookId = this.bookList[bookIdx].bookId
      this.BUInfo.bookCover = this.bookList[bookIdx].imgUrl
      this.unitList = this.bookList[bookIdx].unitList
      this.selectedUnitIdx = 0
      this.BUInfo.unitId = this.unitList[0] ? this.unitList[0].unitId : ''
      this.BUInfo.unitName = this.unitList[0] ? this.unitList[0].unitName : ''
      this.sectionList = this.unitList[0] ? this.unitList[0].sectionList : []
      this.selectIdAll = []
      this.stage = getDefaultStage()
      if (this.sectionList.length > 0) this.checkOne(this.sectionList[0])
      this.detailNum = 0
      this.detailTime = 0
    },
    doCheckSelectedAllWork (selected) {
      const stages = this.stage
      let isCheckedAllWork = selected

      if (selected) {
        for (let i = 0; i < stages.length; i++) {
          let disCount = 0
          stages[i].type.forEach((t) => {
            if (t.disabled) disCount++
          })

          if (!stages[i].checkAll && disCount < stages[i].type.length) {
            isCheckedAllWork = false
            break
          }
        }
      }

      this.isCheckedAllWork = isCheckedAllWork
      this.handleCountTime()
    },
    fetchBookList () { // 获取 book & unit & section 数据
      const scId = this.$store.state.student.classId
      this.$ajax.get('/SynPractice/getStuBook', { scId }, (res) => {
        if (res.status === 1) {
          this.bookList = res.data
          this.bookCount = this.bookList.length
          if (this.bookCount > 0) this.doResetBookUnitSection(0)
          this.status_ = 'done'

          let bgf = Math.abs(this.bookGalleryOffset)
          let bc = Math.ceil(this.bookCount / 5) - 1
          if (bgf > bc) {
            this.handleMoveGallery(bc - bgf)
          }
        }
      })
    },
    fetchWork () { // 根据 unitId & sectionId 获取作业内容
      this.stage = getDefaultStage() // 重置stage状态

      if (this.selectIdAll.length) {
        const unitId = this.unitList[this.selectedUnitIdx].unitId
        let query = ''

        this.selectIdAll.forEach((section) => {
          query += '&sectionIdList[]=' + section.sectionId
        })

        this.$ajax.get('/SynPractice/getContentByUnit?unitId=' + unitId + query, false, (res) => {
          const data = this.practiceData = res.data
          console.log(data)
          const stage = this.stage
          const work = {
            word: [],
            sent: [],
            para: [],
            dialog: [],
            phrase: []
          }
          let detailCount = {}

          const keys = ['word', 'sent', 'para', 'dialog', 'phrase']

          for (let key in data) {
            let section = data[key]
            section.phrase = section.word.filter(word => !word.content.match(/[-| |\u4E00-\u9FA5]/))
            keys.forEach((key) => {
              work[key] = work[key].concat(section[key])

              detailCount[key] = {
                word: 0,
                sent: 0
              }

              if (work[key] && work[key].length > 0) {
                if (key === 'word') {
                  detailCount.word.word += work[key].length
                  console.log(detailCount.word.word)
                } else if (key === 'phrase') {
                  detailCount.phrase.word += work[key].length
                } else if (key === 'sent') {
                  detailCount.sent.sent += work[key].length

                  work[key].forEach(function (sent) {
                    detailCount.sent.word += sent.content.split(' ').length
                  });
                } else if (key === 'para') {
                  work[key].forEach(function (para) {
                    detailCount.para.word += para.content.split(' ').length
                  });
                } else {
                  detailCount.dialog.sent += work[key].length
                }
              }
            })
          }
          stage[0].type[0].disabled = stage[1].type[0].disabled = stage[2].type[1].disabled = work.word.length === 0
          stage[0].type[1].disabled = stage[1].type[1].disabled = work.sent.length === 0
          stage[0].type[2].disabled = stage[1].type[2].disabled = stage[3].type[0].disabled = work.para.length === 0
          stage[0].type[3].disabled = stage[1].type[3].disabled = work.dialog.length === 0
          stage[2].type[0].disabled = work.phrase.length === 0

          this.stage = stage
          this.work = work
          this.detailCount = detailCount
          this.practiceData = data
        })
      } else {
        this.work = {
          word: [],
          sent: [],
          para: [],
          dialog: [],
          phrase: []
        }
        this.detailCount = {}
        this.practiceData = []
      }
    },
    handleMoveGallery (direction) { // 左右移动书本
      const bookCount = this.bookCount
      let offset = this.bookGalleryOffset
      offset += direction
      let absOffset = Math.abs(offset)

      if (offset > 0) {
        offset = 0
      } else if (absOffset > Math.ceil(bookCount / 5) - 1) {
        offset = 0 - Math.ceil(bookCount / 5) + 1
      } else {

      }

      this.bookGalleryOffset = offset
      this.showSelectedBookArrow = false

      setTimeout(() => {
        this.showSelectedBookArrow = this.selectedBookIdx >= absOffset * 5 && this.selectedBookIdx < (absOffset + 1) * 5
      }, 380)
    },
    handleSelectBook (bookIdx, book) { // 选择书本
      this.isCheckedAllWork = false
      this.doResetBookUnitSection(bookIdx)
    },
    handleChangeTab (idx, selectedTab) { // 切换【基础训练】和【拓展练习】
      const { tab, activeTabIndex } = this
      if (activeTabIndex > -1) {
        tab[activeTabIndex].selected = false
        this.$set(this.tab, activeTabIndex, tab[activeTabIndex])
      }
      tab[idx].selected = true
      this.$set(this.tab, idx, tab[idx])

      this.activeTabIndex = idx
    },
    selectUnit (unit, idx) { // 选择一个二级项目
      this.BUInfo.unitId = unit.unitId
      this.BUInfo.unitName = unit.unitName
      this.selectedUnitIdx = idx
      this.sectionList = unit.sectionList
      this.selectIdAll = []
      this.stage = getDefaultStage()
      if (this.sectionList.length > 0) this.checkOne(this.sectionList[0])
      this.detailNum = 0
      this.detailTime = 0
    },
    selectAll () { // 全选三级列表
      this.isCheckedAll = !this.isCheckedAll
      if (this.isCheckedAll) {
        this.selectIdAll = []
        this.sectionList.forEach((section) => {
          this.selectIdAll.push(section)
        })
      } else {
        this.selectIdAll = []
      }
      this.fetchWork()
    },
    checkOne (section) { // 选择一个三级项目
      let unitIndex = this.selectIdAll.indexOf(section)
      if (unitIndex > -1) {
        this.selectIdAll.splice(unitIndex, 1)
      } else {
        this.selectIdAll.push(section)
      }
      this.isCheckedAll = this.selectIdAll.length === this.sectionList.length

      this.fetchWork()
    },
    handleClickWork (stageIdx, typeIdx, selected) {
      const stages = this.stage
      const stage = stages[stageIdx]
      const types = stage.type

      if (typeof typeIdx === 'number') { // 点选一个题型
        const type = types[typeIdx]

        type.selected = selected

        if (selected) {
          stage.checkAll = true
          for (let i = 0; i < types.length; i++) {
            const t = types[i]
            if (!t.disabled && !t.selected) {
              stage.checkAll = false
              break
            }
          }
        } else {
          stage.checkAll = false
        }
      } else { // 点选一组题型
        let disabledCount = 0

        for (let i = 0; i < types.length; i++) {
          const t = types[i]
          if (!t.disabled) {
            t.selected = selected
          } else {
            disabledCount++
          }
        }

        if (disabledCount !== types.length) stage.checkAll = selected
      }

      this.stage = stages
      this.doCheckSelectedAllWork(selected)
    },
    handleToggleCheckAllWork () {
      const selected = this.isCheckedAllWork = !this.isCheckedAllWork
      const stage = this.stage
      stage.forEach((s) => {
        let disCount = 0
        s.type.forEach((t) => {
          if (!t.disabled) t.selected = selected
          else disCount++
        })
        if (disCount < s.type.length) s.checkAll = selected
      })

      this.handleCountTime()
    },
    handleCountTime () {
      let works = []
      let count = 0
      let time = 0
      const stage = this.stage
      stage.forEach((s) => {
        s.type.forEach((t) => {
          works.push(t)
        })
      })

      works.forEach((w, idx) => {
        if (!w.disabled && w.selected) {
          count++
          if (timeCalcs[idx].indexOf('n') > -1) time += Math.ceil(eval(timeCalcs[idx].replace(/n/, this.detailCount[w.type].word)))
          else time += Math.ceil(eval(timeCalcs[idx].replace(/N/, this.detailCount[w.type].sent)))
        }
      })

      this.detailNum = count
      this.detailTime = time
    },
    handleShowPreview (idx) { // 预览一组（课前预习 | 课后练习 | 听力强化 | 背诵通关）任务
      this.previewStage = this.stage[idx]
      this.isShowPreview = true
    },
    handleHidePreview () {
      this.isShowPreview = false
    },
    toggleBooks () { // 显示/隐藏书本编辑窗口
      this.isShowBooks = !this.isShowBooks
      if (!this.isShowBooks) {
        this.fetchBookList()
      }
    },
    goToPractice () {
      if (this.detailNum > 0) {
        let stageParam = []
        let params = Object.assign({}, this.BUInfo, {
          estimateMin: this.detailTime,
          sectionInfoList: [],
        })

        this.stage.forEach((s, idx) => {
          s.type.forEach((t, ix) => {
            if (t.selected) stageParam.push(t.idx + '_' + ['gd', 'ld', 'tx', 'bs'][idx])
          })
        })

        this.selectIdAll.forEach((s, idx) => {
          params.sectionInfoList.push(Object.assign({}, s, {
            practiceList: stageParam
          }))
        })

        this.$api.addSelfLearn(params, (res) => {
          window.location.href = '/practice/work?isTask=0&worksetId=' + res.selfLearnId
        })
      }
    },
  },
  created () {
    this.$ajax.get('/students/info', {}, (res) => {
      const vipInfo = res.data.vip
      this.$store.commit('setVipInfo', vipInfo)
      this.show = true
    })
    this.$on('showHelp', () => {
      this.visible = true
    })
  },
  mounted () {
    this.fetchBookList()
    this.loadingHeight = this.getNavHeight()
  }
}
</script>

<style lang="less">
#stu-sync {
  .head {
    padding: 10px 30px 0;
    border-bottom: #eee 1px solid;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 18px;
      color: #666;
      line-height: 70px;
    }
  }

  .book-gallery {
    position: relative;
    display: flex;
    align-items: center;
    padding: 20px 30px 30px;
    border-bottom: 1px solid #eee;

    .icon {
      display: block;
      width: 40px;
      height: 40px;
      background-image: url('/static/images/icon_turn.png');
      cursor: pointer;
      &.icon-left {
        background-position-x: 80px;

        &.disabled {
          background-position-x: 0;
        }
      }
      &.icon-right {
        background-position-x: -120px;

        &.disabled {
          background-position-x: -40px;
        }
      }
    }

    .book-wrapper {
      position: relative;
      flex: 1;
      margin: 0 40px;
      overflow: hidden;

      .pointer {
        position: absolute;
        display: none;
      }

      .books {
        display: flex;
        transition: transform 400ms;

        .book {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          width: 120px;
          height: 160px;
          margin-left: 30px;
          border-radius: 4px;
          overflow: hidden;
          // border: 1px solid #ccc;

          &:first-child {
            margin-left: 0;
          }

          img {
            display: block;
            width: 100px;
            height: 134px;
            border-radius: 4px;

            &.superscript {
              width: 59px !important;
              height: 59px !important;
              position: absolute;
              top: 26px;
              left: 10px;
              z-index: 9;
            }
          }

          .no-book-cover {
            position: absolute;
            bottom: 0;
            left: 10px;
            width: 100px;
            padding: 5px;
            color: #fff;
            font-size: 12px;
            background-color: rgba(0, 0, 0, 0.6);
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
          }

          .valid {
            width: 100px;
            height: 134px;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            margin: 0 auto;
            z-index: 9;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.6);
          }

          &.selected {
            img {
              display: block;
              width: 120px;
              height: 160px;
            }

            .superscript {
              top: 0;
              left: 0;
            }

            .no-book-cover {
              left: 0;
              width: 120px;
            }

            .valid {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    .selected-book-tag {
      position: absolute;
      bottom: -1px;
      left: 50%;
      width: 34px;
      height: 18px;
      background-image: url('../../../assets/image/stu/sync/arrow.png');
    }
  }

  .empty {
    width: 300px;
    height: 300px;
    margin: 50px auto 0;
    display: block;
    position: relative;

    p {
      width: 100%;
      position: absolute;
      top: 230px;
      left: 0;
    }
  }

  .unit-and-section {
    display: flex;

    .unit-wrapper,
    .third-wrapper {
      padding-top: 20px;
      padding-bottom: 30px;
    }

    .divide {
      border-right: 1px solid #e1f7e5;
    }

    .unit,
    .third {
      height: 200px !important;

      .vuescroll-vertical-rail {
        margin-right: 4px !important;
      }
    }

    .unit-wrapper {
      width: 300px;

      .unit {
        // width: 320px;
        padding: 20px 0;
        overflow: hidden;

        li {
          padding-left: 30px;
          cursor: pointer;

          p {
            width: 230px;
            height: 40px;
            color: #666;
            line-height: 40px;
          }

          &.active {
            background-color: #f2fbf7;

            p {
              color: #21bd73;
              font-weight: bold;
            }
          }
        }
      }
    }

    .third-wrapper {
      flex: 1;
      padding: 20px 30px 30px 40px;

      .third {
        li {
          display: flex;
          align-items: center;
          height: 40px;
          cursor: pointer;

          .icon {
            width: 16px;
            height: 16px;
            margin-right: 25px;
            background-image: url('/static/images/icon_common.png');
            &.active {
              background-position-x: -16px;
            }
          }

          &.active {
            span {
              color: #21bd73;
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  .homework {
    margin-top: 10px;

    .tab-container.tzlx {
      height: 691px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: url('/static/images/stu/sync/pic_empty-08.png') no-repeat center 50px;

      p:first-child {
        margin-top: 280px;
      }
    }

    .block-container {
      padding: 0 30px 30px;
    }

    .operation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 30px;
      border-top: 1px solid #efefef;

      .left {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .checkbox {
          width: 16px;
          height: 16px;
          margin-right: 10px;
          background-image: url('/static/images/icon_common.png');
          cursor: pointer;

          &.active {
            background-position-x: -16px;
          }
        }
      }

      .right {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .button {
          width: 160px;
          height: 60px;
          border-bottom-right-radius: 10px;
          color: #fff;
          font-weight: bold;
          text-align: center;
          line-height: 60px;
          background-color: #24cc7c;
          cursor: pointer;

          &.disabled {
            background-color: #ccc;
            cursor: default;
          }
        }

        .gray9,
        .button {
          margin-left: 20px;
        }
      }
    }
  }
  .jc_title{
    font-size: 20px;
    font-weight: bold;
  }
  .jc_text{
    width: 320px;
    text-align: left;
    margin-top: 20px;
  }
  .jc_img{
    margin: 20px 0;
  }
}
#stu-sync .homework .stage .type .icon.phrase {
  background-image: url(/static/images/icon_dcjy.png) !important;
}
#stu-sync .homework .stage .type.active .icon.phrase {
  background-position-x: 100px;
}
#stu-sync .homework .stage .type.disabled .icon.phrase {
  background-position-x: 50px;
}
</style>
