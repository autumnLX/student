<template lang="pug">
  div.contain.section
    div.block
      div.title.f16.grey6 推荐练习
      div.row
        //- router-link.link.dfj(:to='{name: "StuAggregateMain", params: {vip: $store.state.isVIP}}' tag='div')
        div.link.dfj(@click='handleLinkTo("StuAggregateMain")')
          p.title 低分集
          p.msg  收集了我的低分题
        //- router-link.link.scb(:to='{name: "StuCollectionMain", params: {vip: $store.state.isVIP}}' tag='div')
        div.link.scb(@click='handleLinkTo("StuCollectionMain")')
          p.title 收藏本
          p.msg  我收藏的题都在这儿
        //- router-link.link.yb(:to='{name: "Phonetics", params: {vip: $store.state.isVIP}}' tag='div')
        div.link.yb(@click='handleLinkTo("Phonetics")')
          p.title  音标学习
          p.msg  英语发音基础
    div.block
      div.title.f16.grey6 听说考试
      div.row
        //- router-link.link.tsks(:to='{name: "stuTSKS", params: {vip: $store.state.isVIP}}' tag='div')
        div.link.tsks(@click='handleLinkTo("stuTSKS")')
          p.title  听说考试
          p.msg  仿真人机对话考场
        //- router-link.link.zxxl(:to='{name: "stuSpecial", params: {vip: $store.state.isVIP}}' tag='div')
        div.link.zxxl(@click='handleLinkTo("stuSpecial")')
          p.title  专项训练
          p.msg  逐项突破 轻松应试
        //- router-link.link.htxm(:to='{name: "stuTopics", params: {vip: $store.state.isVIP}}' tag='div')
        div.link.htxm(@click='handleLinkTo("stuTopics")')
          p.title  话题项目
          p.msg  覆盖课标话题
    div.block
      div.title.f16.grey6 英语说
      div.row
        //- router-link.link.sts(:to='{name: "stuSTS", params: {vip: $store.state.isVIP}}' tag='div')
        div.link.sts(@click='handleLinkTo("stuSTS")')
          p.title  视听说
          p.msg  倾听语言 信息捕获
        //- router-link.link.qjdh(:to='{name: "stuDialogue", params: {vip: $store.state.isVIP}}' tag='div')
        div.link.qjdh(@click='handleLinkTo("stuDialogue")')
          p.title  情景对话
          p.msg  智能对话 全新互动
        //- router-link.link.cjzw(:to='{name: "stuComposition", params: {vip: $store.state.isVIP}}' tag='div')
        div.link.cjzw(@click='handleLinkTo("stuComposition")')
          p.title  口头作文
          p.msg  表达演练 综合提升
</template>
<script>
export default {
  name: 'StuIndexNine',
  methods: {
    handleLinkTo(pathName) {
      if (this.$store.state.isVIP) {
        this.$router.push({ name: pathName })
      } else {
        this.$store.commit('toggleChargeModel')
      }
    }
  }
}
</script>
<style lang="less">
@image-url: "../../../assets/image/stu/index";
.contain {
  padding: 10px 40px 20px 40px;
  width: 680px;
  height: auto;

  .block {
    margin-bottom: 10px;

    .title {
      line-height: 50px;
    }

    .row {
      display: flex;
      justify-content: space-between;
      height: 190px;
      width: 100%;
      align-items: center;

      .link {
        position: relative;
        width: 170px;
        height: 190px;
        border-radius: 5px;
        background-repeat: no-repeat;
        background-position: center;
        overflow: hidden;

        &::after {
          content: "";
          position: absolute;
          top: 0px;
          right: 0px;
          display: block;
          width: 42px;
          height: 22px;
          background-image: url("/static/images/stu/index/ic_vip.png");
        }

        &:hover {
          box-shadow: #ccc 0 5px 20px;
          transition: all 0.5s;
          cursor: pointer;
        }
        &.dfj {
          background-image: url("@{image-url}/study_bg-01.png");
        }
        &.scb {
          background-image: url("@{image-url}/study_bg-02.png");
        }
        &.yb {
          background-image: url("@{image-url}/study_bg-03.png");
        }
        &.tsks {
          background-image: url("@{image-url}/study_bg-02.png");
        }
        &.zxxl {
          background-image: url("@{image-url}/study_bg-03.png");
        }
        &.htxm {
          background-image: url("@{image-url}/study_bg-01.png");
        }
        &.sts {
          background-image: url("@{image-url}/study_bg-03.png");
        }
        &.qjdh {
          background-image: url("@{image-url}/study_bg-01.png");
        }
        &.cjzw {
          background-image: url("@{image-url}/study_bg-02.png");
        }

        p {
          color: #fff;
          text-align: center;
          &.title {
            margin-top: 55px;
            margin-bottom: 15px;
            font-size: 20px;
            font-weight: bold;
          }

          &.msg {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>