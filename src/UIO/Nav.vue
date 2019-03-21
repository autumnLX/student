<template lang="pug">
  div.nav
    ul
      li(v-for='(o, idx) of list')
        router-link(:to='{name: o.href}' v-if='idx < list.length - 1') {{ o.title }}
        span(v-else) {{ o.title }}
          i(:class='{hover:isHoverFlag}' v-if='o.hover' @mouseover='overShow()' @mouseout='outHide')
          span.tips(v-if='isHoverFlag') {{o.hoverText}}

</template>

<script>
export default {
  name: 'Nav',
  props: ['list'],
  data() {
    return {
      isHoverFlag: false
    }
  },
  methods: {
    overShow() {
      this.isHoverFlag = true
    },
    outHide() {
      this.isHoverFlag = false
    }
  }
}
</script>

<style lang="less">
.nav {
  padding: 10px 30px 0;
  border-bottom: 1px solid #eee;

  ul {
    display: flex;
    align-items: center;
    height: 70px;

    li {
      a,
      span {
        font-size: 18px;
      }

      a {
        color: #21bd73;
      }

      span {
        color: #666;
        position: relative;

        i {
          position: absolute;
          top: 50%;
          right: -30px;
          width: 20px;
          height: 20px;
          margin-top: -10px;
          background: url('../assets/image/stu/icon_tips.png') no-repeat center;
          background-position: 0 0;
        }
        i.hover {
          background-position: -20px 0;
        }

        .tips {
          position: absolute;
          left: 105px;
          top: -7px;
          width: 205px;
          font-size: 12px;
          height: 35px;
          line-height: 35px;
          padding: 0 10px;
          color: #fff;
          background: rgba(36, 204, 124, .8);
          border-radius: 4px;

          &::after{
            content: '';
            position: absolute;
            border: 10px solid transparent;
            border-top-color: rgb(36, 204, 124);
            opacity: 0.8;
            top: 50%;
            left: -20px;
            margin-left: 0;
            margin-top: -10px;
            transform: rotate(90deg);
          }
        }
      }

      &::after {
        content: ">";
        padding: 0 10px;
        color: #21bd73;
        font-size: 18px;
      }

      &:last-child::after {
        content: "";
        padding: 0;
      }
    }
  }
}
</style>
