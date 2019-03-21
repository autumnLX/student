<template lang="pug">
  div.cover-b
    div.BooksDialog.bg-white
      div.bd-header.f18.fb.white.bg-green
        | {{$t('Stu.StuSync.books.head')}}
        i.bd-close.fr(@click='toggleBooks')
      div.bd-selectBox
        Select(ref="course" :ops="opsCourse")
        Select(ref="grade" :ops="opsGrade")
        Select(ref="level" :ops="opsLevel")
      hr
      div.bd-scrollBox.bg-grey8
        div.empty(v-if='bookList.length <= 0')
          img(src='/static/images/stu/sync/pic_empty-022.png')
          p.f16.greyc.text-ct {{$t('Stu.StuSync.noBook')}}
        vue-scroll(:ops='scrollCfg' v-else)
          ul
            li(v-for='(book, idx) in bookList' :key='book.bookId' :data-idx='idx' @mouseenter='enterBook' @mouseleave='leaveBook')
              img.superscript(v-if='book.bookType === 2' src='/static/images/stu/sync/recommend_kami.png')
              img.superscript(v-if='book.bookType === 1' src='/static/images/stu/sync/recommend_teacher.png')
              img.bookcover(:src='book.imgUrl')
              div.bottom
                p.f12.white {{book.bookName}}
              label.del(@click='delBook(book.bookId)' v-if='book.bookType === 3')
              label.add(@click='addBook(book.bookId, book.courseId, book.bookName)' v-if='book.bookType === 4 && book.isValid && hoverIndex == idx')
              div.valid.white(v-if='!book.isValid') {{$t('Stu.StuSync.notValid')}}
</template>

<script>
import Select from '@/UIO/Select'
export default {
  name: 'books',
  props: ['toggleBooks'],
  components: Object.assign({}, { Select }),
  data() {
    return {
      scrollCfg: {
        bar: {
          vBar: {
            background: '#cccccc'
          },
          hBar: {
            background: '#cccccc'
          }
        }
      },
      opsCourse: {
        callback: (val, txt, index) => {
          this.course = val
          this.getBooks()
        }
      },
      opsGrade: {
        callback: (val, txt, index) => {
          this.grade = val
          this.getBooks()
        }
      },
      opsLevel: {
        callback: (val, txt, index) => {
          this.level = val
          this.getBooks()
        }
      },
      course: '',
      grade: '',
      level: '',
      bookList: [],
      hoverIndex: '',
    }
  },
  methods: {
    renderSelect(data, type, defaultText, idKey, nameKey) {
      const olist = [].concat(data[type])
      let list = [{
        id: 0,
        name: defaultText
      }]

      for (let i = 0; i < olist.length; i++) {
        list.push({
          id: olist[i][idKey],
          name: olist[i][nameKey]
        })
      }

      this.$refs[type].setList(list)
      this.$refs[type].setVal(list[0].id, true)
      this[type] = list[0].id
    },
    getSelectList() {
      this.$ajax.get('/SynPractice/getSearchCond', {
        scId: this.$store.state.student.classId
      }, (res) => {
        if (res.status === 1) {
          this.renderSelect(res.data, 'course', '全部教材', 'courseId', 'realName')
          this.renderSelect(res.data, 'grade', '所有年级', 'grade', 'name')
          this.renderSelect(res.data, 'level', '册数不限', 'level', 'name')
          this.getBooks()
        } else {
          this.$store.commit('showErrDialog', {
            errText: res.info,
            btnText: this.$t('dialog.iknow')
          })
        }
      })
    },
    getBooks() {
      this.$ajax.get('/SynPractice/listBookForAdd', {
        scId: this.$store.state.student.classId,
        row: 999999999,
        page: 1,
        courseId: this.course,
        grade: this.grade,
        level: this.level,
      }, (res) => {
        if (res.status === 1) {
          this.bookList = res.data.list
        } else {
          this.$store.commit('showErrDialog', {
            errText: res.info,
            btnText: this.$t('dialog.iknow')
          })
        }
      })
    },
    enterBook(event) {
      this.hoverIndex = event.target.dataset.idx
    },
    leaveBook(event) {
      this.hoverIndex = ''
    },
    addBook(bid, cid, bName) {
      this.$ajax.post('/SynPractice/bindStuBook', {
        bookId: bid,
        courseId: cid,
        bookName: bName,
      }, (res) => {
        if (res.status === 1) {
          this.getBooks()
        } else {
          this.$store.commit('showErrDialog', {
            errText: res.info,
            btnText: this.$t('dialog.iknow')
          })
        }
      })
    },
    delBook(bid) {
      this.$ajax.post('/SynPractice/unbindStuBook', {
        bookId: bid,
      }, (res) => {
        if (res.status === 1) {
          this.getBooks()
        } else {
          this.$store.commit('showErrDialog', {
            errText: res.info,
            btnText: this.$t('dialog.iknow')
          })
        }
      })
    },
  },
  mounted() {
    this.getSelectList()
  }
}
</script>

<style lang="less">
.BooksDialog {
  width: 800px;
  height: 620px;
  display: flex;
  flex-direction: column;
  position: relative;

  .bd-header {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;

    .bd-close {
      width: 30px;
      height: 30px;
      display: block;
      background: url('../../../assets/image/common/icon_commom3.png') no-repeat -120px 0;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }
  }

  .bd-selectBox {
    display: flex;
    padding: 30px 35px;

    & > div {
      margin-right: 20px;
    }
  }

  .bd-scrollBox {
    height: 480px;
    padding: 20px 5px 30px;

    .vuescroll-content {
      padding: 0 20px;
      display: flex;
      flex-flow: row wrap;

      ul {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;

        li {
          position: relative;
          width: 120px;
          height: 160px;
          margin: 0 15px;
          margin-bottom: 20px;
          border-radius: 4px;

          &:last-child {
            margin-right: auto;
          }

          .superscript {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 9;
          }

          .bookcover {
            width: 100%;
            height: 100%;
          }

          .bottom {
            width: 100%;
            height: 45px;
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 7;
            display: flex;
            align-items: center;
            background: rgba(0, 0, 0, .6);
            padding: 0 8px;
            border-radius: 0 0 4px 4px;

            // p {
            //   height: 28px;
            //   line-height: 14px;
            //   overflow: hidden;
            // }
          }

          label {
            width: 20px;
            height: 21px;
            display: block;
            position: absolute;
            right: 5px;
            bottom: 5px;
            cursor: pointer;
            z-index: 9;

            &.add {
              background: url('../../../assets/image/stu/sync/icon_addbook.png') no-repeat center center;
            }

            &.del {
              background: url('../../../assets/image/stu/sync/icon_removebook.png') no-repeat center center;
            }
          }

          .valid {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 8;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.6);
          }
        }
      }
    }
  }
}
</style>