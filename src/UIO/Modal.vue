<template lang="pug">
  transition(mode='out-in' name='fade')
    div.modal-mask(v-if='value' @click='handleMaskClick' ref='mask')
      div.modal-body(@click.stop='' :style='{width: modalW, height: modalH}')
        div.modal-close(v-if='closable' @click='toggleModal')
        div.modal-header
          slot(name='header')
        div.modal-content
          slot
        div.modal-footer
          slot(name='footer')
</template>

<script>
export default {
  name: 'Modal',
  props: {
    value: {
      required: true
    },
    closable: { // 是否关闭按钮
      default: true
    },
    'mask-closable': { // 是否点击mask关闭
      default: false
    }
  },
  data() {
    return {
      showModal: false,
      modalW: '',
      modalH: '',
    }
  },
  methods: {
    toggleModal() {
      this.$emit('input', false)
    },
    handleMaskClick() {
      if (this.maskClosable) this.toggleModal()
    }
  },
  watch: {
    value: function (val, oldVal) {
      if (val === true) {
        this.$nextTick(() => {
          let $mastAttr = this.$refs.mask.attributes
          if ($mastAttr.width) {
            this.modalW = $mastAttr.width.value + 'px'
            this.$refs.mask.removeAttribute('width')
          }

          if ($mastAttr.height) {
            this.modalH = $mastAttr.height.value + 'px'
            this.$refs.mask.removeAttribute('height')
          }
        })
      }
    }
  },
  mounted() {
  }
}
</script>

<style lang="less">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

// * {
//   outline: none;
//   margin: 0;
//   padding: 0;
//   color: #333333;
//   font-size: 16px;
//   line-height: 1.5em;
// }

.modal-mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;

  .modal-body {
    width: 400px;
    background: #fff;
    border-radius: 5px;
    position: relative;
    overflow: hidden;
    padding: 30px 40px;
    box-sizing: border-box;
    z-index: 1001;

    .modal-close {
      width: 40px;
      height: 40px;
      position: absolute;
      top: 0;
      right: 0;
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAeFJREFUeNrsmEFuwjAQRZ1KrMkRYMO23IBwA47CEThCuAk3wNygSFEWbMqaVbJNFq5/a6oIeZKx46hQ5UsjocTjedjjsZ1IKSWeWW/iyTUCjoAtmmnbapPaCm3qwQrzbmva+gmr2NGW2qRylzS+TvFcGsfaUtVfqemLFTdi1sHYTNd7oNQ6a0tMGvTOwdBwwvQlTd+9AIeAc4LsAtwNBNeE3Pmu4qUtw2+3m8qyTFVVxV4VaAsf+BIiV3fbCKa2hzqIyPNcSClFXdedQ4Q2aAsf+LrEaptiFNaV7cVisRBxHIuiKDoh73BoCx/4ElpRxZwC3FA9TSYTkSRJJ+QjHHzg26JNEEAOpAccGZMq1CigU25+NUEgDziotJUcCpB9zG5CTqc//6ksS1e4X57ggHfI4/H4DQYBdL1eu8JZAf//gfU+xRg9jBwMv7l10hewdM0/5BymFcatk5yYFOCHzwpGznHrJDcmBXjwgXMt5pyY1CrGtvPpA9djN5lru3JHEA1PtheXy4VdhB9HEr6ETja4lzhudV1aQlySOJco70vTkEd+1uWpq1AXpoPzX8Bxd5IhIINeO5uQ+wBwey7cS3z6iHp8YZ2ZUzBsaTnglmb7Ohi7+gSJxk/AI+AI2K4vAQYA35hoh1lR4fwAAAAASUVORK5CYII=");
      cursor: pointer;
    }

    .modal-header {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 18px;
      line-height: 30px;

      .modal-icon {
        height: 50px;
        width: 50px;
        display: block;
        background-image: url("data:image/png;base64,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");

        &.modal-icon-success {
          background-position: 0 0;
        }
        &.modal-icon-warning {
          background-position: -50px 0;
        }
        &.modal-icon-attention {
          background-position: -100px 0;
        }
      }

      .modal-title-big {
        margin-bottom: 10px;
        font-size: 20px;
      }
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 30px;

      button {
        width: 100px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        border-radius: 20px;
        box-sizing: border-box;
        text-align: center;
        margin: 0 15px;
        cursor: pointer;
        background: #fff;
        border: #ccc 1px solid;
        color: #666;

        &.modal-button-green {
          background: #24cc7c;
          color: #fff;

          &:hover {
            background: #21bd73;
          }
        }

        &.modal-button-red {
          background: #ff6666;
          color: #fff;

          &:hover {
            background: #e46c6c;
          }
        }
      }
    }

    .modal-content {
      .modal-text {
        margin: 10px auto;
        color: #666;
        font-size: 14px;
      }

      .modal-text-16 {
        font-size: 16px;
      }

      .modal-text-grey {
        color: #999;
      }
    }
  }
}
</style>
