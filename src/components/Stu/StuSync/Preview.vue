<template lang="pug">
  div.cover-b(ref='cover')
    div.previewDialog.bg-white
      vue-scroll(:ops='scrollCfg' @handle-scroll="handleScroll")
        div.pd-header.f20.fb
          img(src='@/assets/image/stu/sync/icon_book.png')
          | {{$t('Stu.StuSync.preview.head')}}
        div.pd-unit(v-for='(unit, key) in pData')
          div.pd-title.fb.f16.green {{unit.sectionName || 'Summary'}}
          div.pd-unitCnt(v-for='stage in pStage.type' v-if='!stage.disabled && unit[stage.type].length > 0' :class='{active: stage.selected}')
            div.pd-uc-title.f16
              i
              | {{stage.name}}
            div.pd-uc-cnt.bg-grey8(:class='stage.type')
              div.pd-uc-single.bg-white(v-for='single in unit[stage.type]' v-html='renderSingle(stage.type, single)')
      i.pd-close(@click='hidePreview')
</template>

<script>
export default {
  name: 'preview',
  props: ['hidePreview', 'pStage', 'pData'],
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
    }
  },
  methods: {
    scrollEvent(evt) {
      // console.log('deltaY: ' + evt.deltaY + ' | scrolld: ' + this.scrolld)
      if (evt.target === this.$refs.cover) {
        evt.preventDefault()
      } else if (this.scrolld === 1 && evt.deltaY > 0) {
        evt.preventDefault()
      } else if (this.scrolld === -1 && evt.deltaY < 0) {
        evt.preventDefault()
      }
    },
    handleScroll(vertical, horizontal, nativeEvent) {
      // console.log(vertical)
      if (vertical.process > 0.9) {
        this.scrolld = 1
      } else if (vertical.process < 0.1) {
        this.scrolld = -1
      } else {
        this.scrolld = 0
      }
    },
    renderSingle(type, single) {
      let html;
      if (type === 'dialog') {
        html = '<p>'
        for (let i = 0; i < single.content.length; i++) {
          let sc = single.content[i]
          html += '<span>' + sc.role + ': ' + sc.content + '</span>'
        }
        html += '</p>'
      } else if (type === 'para') {
        html = '<p>' + single.content + '</p>'
      } else {
        html = '<span>' + single.content + '</span>'
      }
      return html
    }
  },
  mounted() {
    this.scrolld = -1
    document.body.addEventListener('mousewheel', this.scrollEvent)
    // document.body.onmousewheel = (evt) => {
    //   console.log('deltaY: ' + evt.deltaY + ' | scrolld: ' + this.scrolld)
    //   if (evt.target === this.$refs.cover) {
    //     evt.preventDefault()
    //   } else if (this.scrolld === 1 && evt.deltaY > 0) {
    //     evt.preventDefault()
    //   } else if (this.scrolld === -1 && evt.deltaY < 0) {
    //     evt.preventDefault()
    //   }
    // }
  },
  beforeDestroy() {
    document.body.removeEventListener('mousewheel', this.scrollEvent)
  }
}
</script>

<style lang="less">
.previewDialog {
  width: 1000px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-content: space-between;
  position: relative;
  padding: 40px 10px 20px;

  .pd-close {
    width: 30px;
    height: 30px;
    display: block;
    position: absolute;
    top: 10px;
    right: 10px;
    background: url("../../../assets/image/stu/StuPhonetics/view_btn_close.png")
      no-repeat center center;
    cursor: pointer;
  }

  .vuescroll-content {
    padding: 0 50px;
    display: flex;
    flex-direction: column;

    .pd-header {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;

      img {
        margin-right: 8px;
      }
    }

    .pd-unit {
      .pd-title {
        line-height: 40px;
        margin-bottom: 10px;
      }

      .pd-unitCnt {
        .pd-uc-title {
          height: 30px;
          display: flex;
          align-items: center;
          color: #ccc;

          i {
            width: 8px;
            height: 8px;
            margin-left: 5px;
            margin-right: 10px;
            background-color: #ddd;
            display: block;
            border-radius: 4px;
          }
        }

        .pd-uc-cnt {
          padding: 20px 0 10px;
          display: flex;
          flex-flow: row wrap;
          border-radius: 4px;
          margin-bottom: 20px;

          &.para {
            flex-flow: column wrap;
          }

          &.dialog {
            display: flex;
            flex-direction: column;

            p {
              display: flex;
              flex-direction: column;
            }
          }

          .pd-uc-single {
            min-height: 40px;
            line-height: 24px;
            padding: 8px 40px;
            margin: 0 10px 10px;
            border-radius: 20px;
            display: flex;
            align-items: center;

            p,
            span {
              color: #ccc;
              text-align: left;
            }
          }
        }

        &.active {
          .pd-uc-title {
            color: #666;
            i {
              background-color: #21bd73;
            }
          }

          .pd-uc-single {
            p,
            span {
              color: #666 !important;
            }
          }
        }
      }
    }
  }
}
</style>