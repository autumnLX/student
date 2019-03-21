<template lang="pug">
  div.chivox-selectBox.bg-white(:class='{active: showList}' :style='{width: cfg.width + "px", height: cfg.height + "px"}')
    p(
      @click='boxClick'
      ref='selectText'
    )
      span.ellipsis(ref='selectTextSpan') {{selectedText || $t('select.plz')}}
      i.icon-common(:class='showList ? "arrow-down" : "arrow-down-grey"' ref='selectTextI')
    div.chivox-selectList.bg-white(
      v-if='showList'
      :style='{width: cfg.width + "px", height: 22 + cfg.oHeight * Math.min(dataList.length, 5) + "px", top: cfg.height - 1 + "px"}'
    )
      vue-scroll(:ops='scrollCfg')
        ul
          li.ellipsis(
            v-for='(dt, index) in dataList'
            :key='index + "-" + dt.id'
            ref='selectOption'
            @click='selected($event, dt.id, dt.name, index)'
            :class='{active: dt.id == $refs.selectText.dataset.custom}'
            :title='dt.name'
            :style='{height: cfg.oHeight + "px"}'
          )
            span.ellipsis {{dt.name}}
</template>

<script>
export default {
  name: 'mselect',
  props: ['ops'],
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
      cfg: {
        width: 200,
        height: 34,
        oHeight: 30,
        callback: () => { }
      },
      showList: false,
      selectedText: '',
      dataList: [],
    }
  },
  methods: {
    boxClick() {
      this.showList = !this.showList
    },
    selected(event, val, txt, index, notDoCB) {
      this.selectedText = txt
      this.$refs.selectText.dataset.custom = val
      this.hideSelect(event)
      if (!notDoCB) this.cfg.callback(val, txt, index)
    },
    hideSelect(event) {
      const selecttext = [
        this.$refs.selectText,
        this.$refs.selectTextSpan,
        this.$refs.selectTextI
      ]
      if (selecttext.indexOf(event.target) < 0) {
        this.showList = false
      }
    },
    setList(dataList) {
      !Array.isArray(this.dataList) && console.info('dataList不是数组')
      this.dataList = dataList
    },
    searchList(val) {
      let res = {}
      for (let i = 0; i < this.dataList.length; i++) {
        let dt = this.dataList[i]
        if (val === dt.id) {
          res.id = dt.id
          res.name = dt.name
          res.index = i
          break
        }
      }
      return res
    },
    setVal(val, notDoCB) {
      let isInList = this.searchList(val)
      if (isInList.index >= 0) this.selected({}, isInList.id, isInList.name, isInList.index, notDoCB)
    },
    getVal() {
      return this.$refs.selectText.dataset.custom
    },
    getText() {
      return this.$refs.selectText.innerText.trim()
    },
    setText(txt) {
      this.$refs.selectText.innerText = txt
    }
  },
  mounted() {
    this.cfg = Object.assign({}, this.cfg, this.ops)
    typeof this.cfg.callback !== 'function' && console.info('callback不是方法')

    document.removeEventListener('click', this.hideSelect)
    document.addEventListener('click', this.hideSelect)
  }
}
</script>

<style lang="less">
@border: 1px solid #ccc;
.chivox-selectBox {
  border: 1px solid #ccc;
  display: flex;
  position: relative;
  cursor: pointer;

  & > p {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 36px;
    position: relative;

    i {
      position: absolute;
      top: 50%;
      right: 10px;
      margin-top: -8px;
    }
  }

  &.disabled {
    border-color: #ddd;
    background: #eee;
    cursor: default;

    span {
      font-size: #999;
    }
  }

  &.active {
    border-color: #21bd73;
  }

  .chivox-selectList {
    border: @border;
    position: absolute;
    left: -1px;
    padding-top: 10px;
    padding-bottom: 10px;
    z-index: 10;

    li {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 0 10px;
      text-align: left;

      &.active {
        background-color: #ccf0df;
      }

      &:hover {
        background-color: #f2fbf7;
      }

      &.disabled span {
        color: #ccc;
      }
    }
  }
}
</style>
