<template lang="pug">
  div#dialog-promote(:style='{backgroundImage: url(dialogConfig.bg)}')
    i.icon-common4.icon-close(@click='dialogConfig.closeCallBack')
    p.promotion-texttop.f20.white(:style='{visibility: !dialogConfig.topText ? "hidden" : "visible"}') {{dialogConfig.topText}}
    p.promotion-name.f20 {{dialogConfig.nameText}}
    p.promotion-text.f20 {{dialogConfig.text}}
    div.promotion-btnBox
      button.btn.btn-l(v-for='btn in dialogConfig.button' :class='"btn-" + btn.type' @click='btn.callback') {{btn.text}}
    p.promotion-tip.f12.grey9 {{dialogConfig.tips}}
</template>

<script>
export default {
  name: 'Promote',
  props: ['closeDialog', 'dialogConfig'],
  data() {
    return {
    }
  }
}
</script>

<style lang='less'>
#dialog-promote {
  width: 350px;
  height: 400px;
  background-image: url(/static/images/stu/index/bg_promotion.png);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  width: 400px;
  margin: -200px 0 0 -175px;
  border-radius: 5px;
  overflow: hidden;
  background: #fff;
  z-index: 10;

  &.promoteGrade {
    background-image: url(/static/images/stu/index/bg_newterm.png);
  }

  i {
    position: absolute;
    top: 5px;
    right: 5px;
  }

  p {
    line-height: 24px;
  }

  a, button {
    width: 120px;
  }

  button {
    margin-left: 30px;
  }

  .promotion-texttop {
    margin-top: 104px;
  }

  .promotion-name {
    margin-top: 64px;
    margin-bottom: 10px;
  }

  button {
    margin-top: 50px;
    margin-bottom: 20px;
  }
}
</style>