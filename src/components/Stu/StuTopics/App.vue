<template lang="pug">
  div.section.flex-center-center(v-if='status_ === "loading"' :style='{ height: loadingHeight }')
    Loading
  #stu-htxm(v-else)
    div.section
      Nav(:list='nav')
      dl.filter 
        dt 话题
        dd
          span(
            v-for='(o, idx) in courseList'
            :key='o.id'
            :class='{active: o.id === course[0]}'
            @click='selectCourse(o.id, 0)'
          ) {{o.name}}
      dl.filter 
        dt 分类
        dd
          span(
            v-for='(o, idx) in courseListC'
            :key='o.id'
            :class='{active: o.id === course[1]}'
            @click='selectCourse(o.id, 1)'
          ) {{o.name}}
    div.section.down
      p.count.gray9 共
        span.green  {{ totalNum }} 
        | 道题
      div
      div.stu-topic(v-for='(o, idx) in list' :class='{expand: o.expand}' v-if="true")
        div.info-bar
          div
            span.a.gray6.f14 {{ pageNum === 1 ? idx + 1 : (idx + 1) + (pageNum - 1) * 10 }}. {{o.topicTypeName}}
            span.b.gray9.f14 考察能力：语言能力
            span.b.gray9.f14 知识点：{{o.knowledgeTxt || '-'}}
            span.b.gray9.f14 难度：
              Star(:level='o.difficulty')
        //- 看图回答问题、口语问答
        div.content-block(v-if='o.topicType === "28" || o.topicType === "18"' :class='{kywd: o.topicType === "18", kthtwd: o.topicType === "28"}')
          div.contentMain
            img(v-if='o.topicAttachment.length' :src='$config.resUrl + o.topicAttachment[0].attachmentUrl' @click='getLargeImage($config.resUrl + o.topicAttachment[0].attachmentUrl)')
            div.right
              div.info(v-for='(item, idx) in JSON.parse(o.topicOption)' :key='idx')
                span 问题{{idx + 1}}：
                i.icon-common3(@click='play($config.resUrl + item.audio ? item.audio.attachmentUrl : "", $event)')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 视听说视频
        div.content-block.stssp(v-else-if='o.topicType === "16"')
          div.contentMain
            div.box
              video(:src='$config.resUrl + o.topicAttachment[0].attachmentUrl' controls) 您的浏览器不支持此种视频格式。
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 听后选择
        div.content-block(v-else-if='o.topicType === "47" || o.topicType === "19" || o.topicType === "20" ||o.topicType === "67"||o.topicType === "68"||o.topicType === "69"|| o.topicType === "21" || o.topicType === "72"' :class='{thxz: o.topicType === "47", dwlj: o.topicType === "19" || o.topicType === "20" || o.topicType === "21"|| o.topicType === "67"||o.topicType === "68"||o.topicType === "69"||o.topicType === "72"}')
          div.contentMain
            div.vocie
              span 听力原文：
              i.icon-common3.icon-voice(@click='replay(o.topicAttachment[0].attachmentUrl, $event)')
            div(v-if='o.topicType === "21" || o.topicType === "47"' :class='{thxzCot: o.topicType === "47", dwljCot: o.topicType === "21"}')
              dl(v-for='(item, idx) in JSON.parse(o.topicOption)' :key='idx')
                dt {{idx + 1}}.
                  div(v-html='$options.filters.toggleImg(item.topicStem)')
                div.options
                  dd(v-for='(k, i) in item.options' :title="$options.filters.toggleImg(k.optionDesc).replace(/&nbsp;/g,' ').replace(/<[^>]+>/g, '')")
                    span {{k.option}}.
                    div(v-html='$options.filters.toggleImg(k.optionDesc)')
            div(v-else-if='o.topicType === "19" || o.topicType === "72"' :class='{ddhlj: o.topicType === "19" || o.topicType === "72", dwljCot: o.topicType === "20"}')
              dl.ddlj_topic
                dt 1.
                  div(v-html='$options.filters.toggleImg(o.topicContent)')
                div.options
                  dd(v-for='(k, i) in JSON.parse(o.topicOption)' :title="k.optionDesc.replace(/&nbsp;/g,' ').replace(/<[^>]+>/g, '')")
                    span {{k.option}}.
                    div(v-html='$options.filters.toggleImg(k.optionDesc)') 
            div(v-else-if='o.topicType === "20"||o.topicType === "67"||o.topicType === "68"||o.topicType === "69"' :class='{thxzCot: o.topicType === "19", dwljCot: o.topicType === "20"||o.topicType === "67"||o.topicType === "68"||o.topicType === "69"}')
              img(v-if="o.topicType === '68'" :src='$config.resUrl + o.topicAttachment[1].attachmentUrl' style="width:50%;margin-top:6px")
              dl(v-for='(item, idx) in JSON.parse(o.topicOption)' :key='idx')
                dt {{idx + 1}}. 
                  div(v-html='$options.filters.toggleImg(item.topicStem)')
                div.options
                  dd(v-for='(k, i) in item.options' :title="k.optionDesc.replace(/&nbsp;/g,' ').replace(/<[^>]+>/g, '')")
                    span {{k.option}}.
                    div(v-html='$options.filters.toggleImg(k.optionDesc)')   
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 听力选答
        div.content-block(v-else-if='o.topicType === "52" || o.topicType === "53"' :class='{yc_tlxd1: o.topicType === "52", yc_tlxd2: o.topicType === "53"}')
          div.contentMain
            div.tlxdMain(v-for='(item, idx) in JSON.parse(o.topicOption)' :key='idx')
              div.vocie
                span 听力原文：
                i.icon-common3.icon-voice(@click='replay(item.audio.attachmentUrl ? item.audio.attachmentUrl : "", $event)')
              div(:class='{yc_tlxd1Cont: o.topicType === "52", yc_tlxd2Cont: o.topicType === "53"}')
                ul.options
                  li(v-for='(k, i) in item.options' :key='i' :title="k.optionDesc.replace(/&nbsp;/g,' ').replace(/<[^>]+>/g, '')")
                    span {{k.option}}.
                    p(v-html='k.optionDesc')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 听句子，选择正确的答语
        div.content-block.tydt(v-else-if='o.topicType === "27"')
          div.contentMain
            div.thjlCont
              div.voice
                span 听力音频：
                i.icon-common3.icon-voice(@click='replay(JSON.parse(o.topicOption)[0].audio.attachmentUrl, $event)')
              div(v-html='o.topicContent')
              div
                span 答案：
                span(v-html='JSON.parse(o.topicOption)[0].optionDesc')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 听对话，选择正确的答案
        div.content-block.tdhdt(v-else-if='o.topicType === "39"')
          div.contentMain
            div.voice
              span 听力音频：
              i.icon-common3.icon-voice(@click='replay(o.topicAttachment[0].attachmentUrl, $event)')
            div(v-html="o.topicContent")
            div(v-html="o.standardAnswer")
            div
              span 答案：
              span(v-html='o.answer')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 听后记录并转述
        div.content-block.thjl(v-else-if='o.topicType === "49"')
          div.contentMain
            img(:src='$config.resUrl + o.topicAttachment[1].attachmentUrl' @click='getLargeImage($config.resUrl + o.topicAttachment[1].attachmentUrl)')
            div.thjlCont
              div.voice
                span 听力音频：
                i.icon-common3.icon-voice(@click='replay(o.topicAttachment[0].attachmentUrl, $event)')
              p.first 第一节：听后记录
              div.inputs
                div.inp(v-for='i in parseInt(JSON.parse(o.topicOption)[0].placeholder)')
                  span {{i}}.
                  input  
              p.second 第二节：听后转述信息
              div(v-html='JSON.parse(o.topicOption)[1].content')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 听对话后填空
        div.content-block.tdhtk(v-else-if='o.topicType === "55"')
          div.contentMain
            img(:src='$config.resUrl + o.topicAttachment[1].attachmentUrl' @click='getLargeImage($config.resUrl + o.topicAttachment[1].attachmentUrl)')
            div.tdhtkCot
              div.voice
                span 听力音频：
                i.icon-common3.icon-voice(@click='replay(o.topicAttachment[0].attachmentUrl, $event)')
              div.inputs
                  div.inp(v-for='i in JSON.parse(o.topicOption)[0].placeholder')
                    span {{i}}.
                    input  
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 听后回答
        div.content-block.thhd(v-else-if='o.topicType === "48"')
          div.contentMain
            div.voice
              span 听力原文：
              i.icon-common3.icon-voice(@click='replay(o.topicAttachment[0].attachmentUrl, $event)')
            div.thhdCont
              span 问题：
              span(v-html='o.topicContent')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 读单词、篇章朗读
        div.content-block.pzldc(v-else-if="o.topicType === '43' || o.topicType === '24' || o.topicType === '26' || o.topicType === '56'" :class='{ddc: o.topicType === "43"|| o.topicType === "24", pzld: o.topicType === "26"}')
          div.contentMain(v-html='o.topicContent')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 看图说单词
        div.content-block.ktsdc(v-else-if="o.topicType === '42'")
          div.contentMain
            img(:src='$config.resUrl + o.topicAttachment[0].attachmentUrl' @click='getLargeImage($config.resUrl + o.topicAttachment[0].attachmentUrl)')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 朗读、短语句子听读、读句子
        div.content-block.djz(v-else-if="o.topicType === '23' || o.topicType === '25' || o.topicType === '44' ||o.topicType === '50' || o.topicType === '70'")
          div.contentMain(v-html='o.topicContent')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 跟读与模仿
        div.content-block.gdymf(v-else-if="o.topicType === '22'")
          div.contentMain
            div.voice
              i.icon-common3.icon-voice(@click='replay(o.topicAttachment[0].attachmentUrl, $event)')
              span(v-html='o.topicContent.replace(/<[^>]+>/g, "")')
            div.qjwdCont
              div.qjwdContain(v-for='(item, i) in JSON.parse(o.topicOption)' :key='i')
                span 第{{i + 1}}句：
                i.icon-common3.icon-voice(@click='replay($config.resUrl + item.audio ? item.audio.attachmentUrl : "", $event)')
                span(v-html='item.topicStem')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 听对话答题
        div.content-block(v-else-if='o.topicType === "54" || o.topicType === "73"' :class='{tdhdt: o.topicType === "54" || o.topicType === "73"}')
          div.contentMain
            div.tdhdtMain(v-for='(item, idx) in JSON.parse(o.topicOption)' :key='idx')
              div.vocie
                span 听力原文：
                i.icon-common3.icon-voice(@click='replay(item.audio.attachmentUrl ? item.audio.attachmentUrl : "", $event)')
              div.tdhdtCot(v-for='(k, i) in item.optionList' :key='"item" + i')
                div.xh
                  span {{k.ordering}}.
                  p(v-html='k.topicStem')
                ul.options
                  li(v-for='(op, index) in k.options' :key='"op" + index' :title="op.optionDesc.replace(/&nbsp;/g,' ').replace(/<[^>]+>/g, '')")
                    span {{op.option}}.
                    p(v-html='op.optionDesc')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 情景问答
        div.content-block.qjwd(v-else-if="o.topicType === '57'")
          div.contentMain
            div.qjwdCont
              p.msg(v-html='o.topicContent')
              div.qjwdContain(v-for='(item, i) in JSON.parse(o.topicOption)' :key='i')
                span 问题{{i + 1}}：
                i.icon-common3(@click='play($config.resUrl + item.audio ? item.audio.attachmentUrl : "", $event)')
                span(v-html='item.questionText')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 情景问答(沈阳)
        div.content-block.qjwd(v-else-if="o.topicType === '71'")
          div.contentMain
            div.qjwdCont
              span 听力音频: 
              i.icon-common3.icon-voice(@click='replay(o.topicAttachment[0].attachmentUrl, $event)')
              div.qjwdContain(v-for='(item, i) in JSON.parse(o.topicOption)' :key='i')
                span 问题{{i + 1}}：
                span(v-html='item.questionText')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 听短对话回答问题
        div.content-block(v-else-if='o.topicType === "74"' :class='{thxz: o.topicType === "74"}')
          div.contentMain
            div.vocie
              span 听力原文：
              i.icon-common3.icon-voice(@click='replay(o.topicAttachment[0].attachmentUrl, $event)')
            div.ddhlj
              dl.ddlj_topic
                dt 1.
                  div(v-html='JSON.parse(o.topicOption)[0].topicStem')
                div.options
                  dd(v-for='(k, i) in JSON.parse(o.topicOption)[0].options' :title="k.optionDesc.replace(/&nbsp;/g,' ').replace(/<[^>]+>/g, '')")
                    span {{k.option}}.
                    div(v-html='k.optionDesc')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 听短文回答问题&听长对话回答问题
        div.content-block(v-else-if='o.topicType === "75" || o.topicType === "76"' :class='{tdhdt: o.topicType === "75" || o.topicType === "76"}')
          div.contentMain
            div.tdhdtMain
              div.vocie
                span 听力原文：
                i.icon-common3.icon-voice(@click='replay(o.topicAttachment[0].attachmentUrl, $event)')
            div.tdhdtMain(v-for='(item, idx) in JSON.parse(o.topicOption)' :key='idx')
              div.vocie
                span {{item.ordering}}.
                sapn(v-html='item.topicStem')
                i.icon-common3.icon-voice(@click='replay(item.attachment[0].attachmentUrl, $event)' :style="{marginLeft: 15+'px'}")
              div.tdhdtCot
                ul.options
                  li(v-for='(op, index) in item.options' :key='"op" + index' :title="op.optionDesc.replace(/&nbsp;/g,' ').replace(/<[^>]+>/g, '')")
                    span {{op.option}}.
                    p(v-html='op.optionDesc')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 情景问答(淄博)
        div.content-block.qjwd(v-else-if="o.topicType === '77'")
          div.contentMain
            div.qjwdCont
              div(:style="{marginBottom: 15+'px'}")
                span 听力音频: 
                i.icon-common3.icon-voice(@click='replay(o.topicAttachment[0].attachmentUrl, $event)')
              div.qjwdContain(v-for='(item, i) in JSON.parse(o.topicOption)' :key='i')
                span 问题{{i + 1}}：
                i.icon-common3(@click='play(item.attachment[0].attachmentUrl, $event)')
                span(v-html='item.questionText')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 模仿朗读、朗读儿歌
        div.content-block(v-else-if="o.topicType === '40' || o.topicType === '46'" :class='{mfld: o.topicType === "40", ldeg: o.topicType === "46"}')
          div.contentMain
            div.voice
              i.icon-common3.icon-voice(@click='replay(o.topicAttachment[0].attachmentUrl, $event)')
            div.mfldCt(v-html='o.topicContent')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 口头作文
        div.content-block.ktzw(v-else-if='o.topicType === "41"')
          div.contentMain
            img(v-if='o.topicAttachment.length > 0' :src='$config.resUrl + o.topicAttachment[0].attachmentUrl' @click='getLargeImage($config.resUrl + o.topicAttachment[0].attachmentUrl)')
            div.ktzwRight
              div.title 要点：
              div.ktzwCont(v-html='o.topicContent')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 听力选图
        div.content-block.tlxt(v-else-if='o.topicType === "51"')
          div.contentMain
            div.main(v-for='(item, idx) in JSON.parse(o.topicOption)')
              div.voice.left
                i.icon-common3.icon-voice(@click='replay(item.audio.attachmentUrl, $event)')
              div.right
                div(v-for='(k, i) in item.options')
                  span {{k.option}}.
                  div(v-html='$options.filters.toggleImg(k.optionDesc)')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 听对话选图
        div.content-block.jszk_tdhxt(v-else-if='o.topicType === "65"||o.topicType === "66"')
          div.contentMain
            div(v-html='o.topicContent')
            div.voice.left
              i.icon-common3.icon-voice(@click='replay(o.topicAttachment[0].attachmentUrl, $event)')
            div.main.right(v-for='(item, idx) in JSON.parse(o.topicOption)')
              span {{item.option}}.
              div(v-html='$options.filters.toggleImg(item.optionDesc)')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
        //- 话题简述
        div.content-block.htjs(v-else-if='o.topicType === "58" || o.topicType === "78"')
          div.contentMain
            div(:style="{marginBottom: 15+'px'}" v-show="o.topicType === '78'")
                span 听力音频: 
                i.icon-common3.icon-voice(@click='replay(o.topicAttachment[0].attachmentUrl, $event)')
            div(v-html='o.topicContent')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? '收起信息' : '详情' }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') 练习
      Pagination(:currentPage="currentPage" :maxNumPage="maxPage" :getSkipPage="getSkipPage")
    //- 大图预览
    div.viewLargeImage(v-if='largeImage' @click='closeLargeImage()')
      img(:src='largeImage' @click='closeLargeImage()')
</template>

<script>
export default {
  name: 'topics',
  data () {
    return {
      status_: 'loading',
      loadingHeight: 'auto',
      nav: [{
        title: '首页',
        href: 'stuIndex'
      }, {
        title: '话题项目'
      }],
      courseList: [{
        id: '0',
        name: '全部',
      }],
      courseListC: [{
        id: '0',
        name: '全部',
      }],
      course: ['0', '0'],
      list: [],
      player: '',
      totalNum: '',
      recorder: '',
      largeImage: '',
      currentPage: 1,
      pageNum: '',
      maxPage: 1
    }
  },
  filters: {
    toggleImg (msg) {
      let resUrl = 'https://17ks.chivoxapp.com/'
      return msg.replace(/(<img[\s\S]*)src=['"]([^'"]+)[.]*/g, '$1src="' + resUrl + '$2')
    }
  },
  methods: {
    getCourse () {
      this.$jsonp('/api/lst_htxm/courseListP', {}, (err, res) => {
        if (res.status === 1) {
          this.courseList.splice(1, this.courseList.length - 1)
          this.courseList = this.courseList.concat(res.data)
          this.selectCourse('0', 0)
        } else {
          console.log(err)
        }
      })
    },
    getCourseC () {
      this.$jsonp('/api/lst_htxm/courseListC?id=' + this.course[0], {}, (err, res) => {
        if (res.status === 1) {
          this.courseListC.splice(1, this.courseListC.length - 1)
          this.courseListC = this.courseListC.concat(res.data)
          this.selectCourse('0', 1)
        } else {
          console.log(err)
        }
      })
    },
    selectCourse (id, level) {
      this.$set(this.course, level, id)
      if (level === 0) {
        if (id === '0') {
          this.courseListC.splice(1, this.courseListC.length - 1)
          this.selectCourse('0', 1)
        } else this.getCourseC(id)
      } else this.getData()
    },
    doMedia (elm, url, clazz) {
      if (this.activeAudioElm) {
        if (this.activeAudioElm !== elm) {
          this.nextActiveAudio = {
            elm,
            url,
            clazz
          }
        }

        this.player.stop()
      } else {
        const activeAudioElm = this.activeAudioElm = elm
        activeAudioElm.classList.add(clazz)
        this.doPlay(url)
      }
    },
    handleGoPractice (idx) {
      this.$router.push({
        name: 'exam',
        query: {
          idx,
          page: this.pageNum,
          from: '3',
          fromUrl: encodeURIComponent(this.$route.fullPath.replace(/\?/g, '{{q}}').replace(/&/g, '{{a}}')),
        }
      })
    },
    handleToggleContent (n) {
      const o = this.list[n]
      o.expand = !o.expand
      this.list.splice(n, 1, o)
    },
    getLargeImage (url) {
      this.largeImage = url
    },
    closeLargeImage () {
      this.largeImage = ''
    },
    removeTag (tag) {
      if (tag && tag.indexOf('<') >= 0 && tag.indexOf('<') >= 0) {
        return tag.replace(/<[^>]+>/g, '')
      } else {
        return tag
      }
    },
    getData (page) {
      let course = []
      if (this.course[0] !== '0') {
        if (this.course[1] === '0') {
          this.courseListC.forEach(el => {
            if (el.id !== '0') course.push(el.id)
          })
        } else {
          course.push(this.course[1])
        }
      }

      this.pageNum = page || 1
      this.$jsonp('/api/lst_htxm/index?page=' + (page || 1) + '&course=' + course.join(','), {}, (err, res) => {
        if (res.status === 1) {
          this.list = []
          this.currentPage = parseInt(res.data.pageInfo.page)
          this.maxPage = Math.ceil(parseInt(res.data.pageInfo.total) / parseInt(res.data.pageInfo.rows)) || 1
          this.totalNum = res.data.pageInfo.total
          for (let i = 0; i < res.data.list.length; i++) {
            let obj = res.data.list[i]
            this.list.push({
              expand: false,
              topicContent: obj.topicContent,
              topicOption: obj.topicOption,
              topicType: obj.topicType,
              topicTypeName: obj.topicTypeName,
              topicAttachment: JSON.parse(obj.topicAttachment),
              answer: obj.answer,
              teacher_answer: obj.teacherAnswer,
              analysis: obj.analysis,
              difficulty: obj.difficulty,
              standardAnswer: obj.standardAnswer,
              knowledgeTxt: obj.knowledgeTxt
            })
          }
          this.status_ = 'done'
        } else {
          console.log(err)
        }
      })
    },
    replay (url, event) {
      this.doMedia(event.target, url, 'replaying')
    },
    play (url, event) {
      this.doMedia(event.target, url, 'playing')
    },
    doPlay (audioUrl, type, callback = function () { }) {
      this.player.stop()
      const self = this
      this.player.load({
        url: this.$config.resUrl + audioUrl,
        success: () => {
          this.player.play({
            onStop: () => {
              self.activeAudioElm.classList.remove('playing', 'replaying')
              self.activeAudioElm = null

              if (self.nextActiveAudio) {
                self.activeAudioElm = self.nextActiveAudio.elm
                self.activeAudioElm.classList.add(self.nextActiveAudio.clazz)
                self.doPlay(self.nextActiveAudio.url)
                self.nextActiveAudio = null
              }

              callback()
            }
          })
        }
      })
    },
    getSkipPage (page) {
      this.getData(page)
    }
  },
  created () {
    this.getCourse()
    this.$store.commit('initAiPanel')
    this.player = this.$store.state.$player
  },
  mounted () {
    this.loadingHeight = this.getNavHeight()
  },
  destroyed () {
    this.player.stop()
  }
}
</script>

<style lang="less">
@image-base-url: "../../../assets/image";
#stu-htxm {
  padding-bottom: 40px;

  .nav {
    margin-bottom: 30px;
  }

  .filter {
    padding: 0 30px 24px;
    display: flex;
    align-items: flex-start;

    dt {
      font-size: 14px;
      color: #999;
      line-height: 24px;
      margin-right: 20px;
    }

    dd {
      flex: 1;
      display: flex;
      flex-wrap: wrap;

      span {
        font-size: 14px;
        color: #666;
        line-height: 24px;
        display: inline-block;
        padding: 0 15px;
        margin-bottom: 6px;
        border-radius: 4px;
        cursor: pointer;

        &.active {
          background: #24cc7c;
          color: #fff;
        }
      }
    }
  }

  .down {
    margin-top: 10px;
    padding: 1px 30px 40px;

    .count {
      line-height: 70px;
    }
  }
}
.viewLargeImage {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.5);
  z-index: 10;

  & > img {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 600px;
    height: 400px;
    margin: -270px 0 0 -300px;
    z-index: 100;
  }
}
.stu-topic {
  width: 890px;
  margin: 0 auto 20px;
  border: 1px solid #f8f8f8;
  border-radius: 10px;
  background-color: #f8f8f8;
  overflow: hidden;
  &.expand {
    .content-block {
      height: auto;
    }

    .toolbar {
      position: relative !important;
      bottom: 0 !important;
      left: 0 !important;
      margin: 0 auto !important;
    }
    .contentMain {
      height: auto !important;
    }
    .contentMain > div {
      height: auto !important;
    }

    .detail {
      display: block !important;
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
  }
  .content-block {
    position: relative;
    padding: 15px 25px;
    height: 148px;
    .contentMain {
      width: 840px;
      padding-left: 30px;
      padding-right: 30px;
      height: 90px;
      display: block;
      overflow: hidden;
    }
    // .detail {
    //   width: 840px;
    //   padding-left: 30px;
    //   padding-right: 30px;
    // }
    .icon-common3 {
      display: inline-block;
      width: 30px;
      height: 30px;
      background-image: url("/static/images/icon_audiogroups.png");
      background-repeat: no-repeat;
      cursor: pointer;
      vertical-align: middle;
      &.playing {
        background: url("/static/images/icon_audiogroups.png") no-repeat center;
        background-position: -30px 0;
      }
    }
    .icon-common3.icon-voice {
      display: inline-block;
      width: 30px;
      height: 30px;
      background-image: url("/static/images/listening.png");
      background-repeat: no-repeat;
      cursor: pointer;
      vertical-align: middle;
      background-position: -60px 0;
      &.replaying {
        animation: replaying 1s steps(1) infinite 0s;
        -moz-animation: replaying 1s steps(1) infinite 0s;
        -webkit-animation: replaying 1s steps(1) infinite 0s;
        -o-animation: replaying 1s steps(1) infinite 0s;
      }
    }
    &.kthtwd,
    &.kywd {
      .contentMain {
        display: flex;
        margin-bottom: 20px;
        img {
          width: 180px;
          height: 120px;
          margin-right: 30px;
        }

        .text {
          color: #666;
          line-height: 24px;
        }
        .right {
          height: auto;
          width: 100%;
          .info {
            line-height: 40px;
            height: 40px;
            margin-bottom: 10px;
            i.active {
              background-position-x: -30px;
            }
            span {
              margin-right: 15px;
            }
          }
        }
      }
    }
    &.pzld,
    &.dwld {
      .contentMain {
        font-size: 16px;
        color: #666;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        // height: auto;
        line-height: 18px;
      }
    }
    &.ddc {
      .contentMain {
        // height: 90px;
        font-size: 36px;
        color: #666;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }
    }
    &.mfld,
    &.ldeg {
      .contentMain {
        display: flex;
        margin-bottom: 20px;
        .voice {
          width: 60px;
          max-height: 90px;
          height: auto;
          margin-right: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mfldCt {
          font-size: 16px;
          color: #666;
          line-height: 18px;
          height: auto;
          width: 700px;
          display: flex;
          align-items: center;
        }
      }
    }
    &.gdymf {
      .voice {
        span {
          display: inline-block;
          padding-left: 15px;
        }
      }
      .qjwdCont {
        padding-top: 15px;
        div {
          span:last-child {
            padding-left: 15px;
          }
        }
      }
    }
    &.ktsdc {
      .contentMain {
        // height: 120px;
        display: flex;
        margin-bottom: 20px;
        img {
          width: 180px;
          height: 120px;
          margin-right: 30px;
        }
      }
    }
    &.djz {
      .contentMain {
        // height: 90px;
        display: flex;
        margin-bottom: 20px;
        font-size: 16px;
        color: #666;
        line-height: 18px;
        align-items: center;
      }
    }
    &.thxz,
    &.dwlj {
      .contentMain {
        display: block;
        .vocie {
          height: 40px;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          span {
            margin-right: 20px;
          }
        }
        .thxzCot,
        .dwljCot,
        .ddhlj {
          margin-bottom: 20px;
          dl {
            &.ddlj_topic {
              p {
                width: 100%;
              }
              .options {
                dd {
                  flex: 1;
                }
              }
            }
            margin-bottom: 10px;
            dt {
              color: #666;
              font-size: 16px;
              line-height: 21px;
              display: flex;
              align-items: flex-start;
              margin-bottom: 10px;
              div {
                margin-left: 20px;
                p {
                  width: 100%;
                  // height: 80px;
                  img {
                    width: 120px;
                    height: 80px;
                    display: block;
                  }
                }
              }
            }
            .options {
              display: flex;
              dd {
                display: flex;
                margin-left: 20px;
                span {
                  display: flex;
                  margin-right: 5px;
                  align-items: flex-start;
                }

                & > div {
                  display: flex;
                  align-items: flex-start;
                  p {
                    width: 120px;
                    // height: 80px;
                    img {
                      width: 120px;
                      height: 80px;
                      display: block;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    &.tdhdt {
      .contentMain {
        display: block;
        .tdhdtMain {
          margin-bottom: 20px;
          .vocie {
            margin-bottom: 10px;
          }
          .tdhdtCot {
            ul {
              color: #666;
              font-size: 16px;
              line-height: 21px;
              margin-bottom: 10px;
              display: flex;
              li {
                display: flex;
                margin-right: 5px;
                width: 260px;
                p {
                  flex: 1;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
            }
            .xh {
              display: flex;
              margin-bottom: 5px;
              span {
                margin-right: 5px;
              }
            }
          }
        }
      }
    }
    &.yc_tlxd1,
    &.yc_tlxd2 {
      .tlxdMain {
        margin-bottom: 20px;
        .vocie {
          margin-bottom: 10px;
        }
      }

      .yc_tlxd1Cont,
      .yc_tlxd2Cont {
        ul {
          color: #666;
          font-size: 16px;
          line-height: 21px;
          margin-bottom: 10px;
          display: flex;
          li {
            display: flex;
            margin-right: 5px;
            width: 260px;
            p {
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
    &.thhd {
      .contentMain {
        display: block;
        .voice {
          height: 40px;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          span {
            margin-right: 20px;
          }
        }
        .thhdCont {
          display: flex;
          margin-bottom: 20px;
        }
      }
    }
    &.thjl {
      .contentMain {
        display: flex;
        img {
          width: 180px;
          height: 120px;
          margin-right: 30px;
        }
        .thjlCont {
          // flex: 1;
          .voice {
            height: 40px;
            color: #999;
            font-size: 14px;
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            span {
              margin-right: 20px;
            }
          }
          p {
            font-size: 14px;
            color: #666;
            line-height: 24px;
            display: flex;
            align-items: center;
            margin-bottom: 10px;
          }
          .inputs {
            display: flex;
            margin-bottom: 10px;
            .inp {
              margin-right: 10px;
              display: flex;
              align-items: flex-end;
              span {
                margin-right: 5px;
              }
              input {
                height: 0;
                width: 60px;
                border: none;
                outline: none;
                border-bottom: 1px solid #ccc;
              }
            }
          }
        }
      }
      // .detail {
      //   display: none;
      //   .secondTitleContain {
      //     margin-bottom: 10px;
      //     display: flex;
      //     .left {
      //       width: 210px;
      //     }
      //     .secondTitle {
      //       flex: 1;
      //     }
      //   }
      //   .secondContContain {
      //     margin-bottom: 10px;
      //     display: flex;
      //     .left {
      //       width: 210px;
      //     }
      //     .secondCont {
      //       font-size: 16px;
      //       color: #666;
      //     }
      //   }

      //   .answer1 {
      //     height: 40px;
      //     margin-bottom: 10px;
      //     display: flex;
      //     align-items: center;
      //     font-size: 14px;
      //     color: #999;
      //     .ans {
      //       margin-left: 10px;
      //       &:first-child {
      //         margin-left: 20px;
      //       }
      //     }
      //   }
      //   .answer2 {
      //     margin-bottom: 10px;
      //     display: flex;
      //     .left {
      //       width: 85px;
      //       max-height: 90px;
      //     }
      //     .right {
      //       flex: 1;
      //       font-size: 16px;
      //       color: #666;
      //       line-height: 18px;
      //     }
      //   }
      //   .anaysis {
      //     height: 40px;
      //     display: flex;
      //     align-items: center;
      //     margin-bottom: 10px;
      //   }
      // }
    }
    &.stssp {
      .contentMain {
        padding-left: 0;
        padding-right: 0;
        margin-bottom: 20px;
        display: flex;
        .box {
          width: 180px;
          height: 120px;
          margin-right: 10px;
          & > video {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    &.ktzw {
      .contentMain {
        display: flex;
        margin-bottom: 20px;
        img {
          width: 180px;
          height: 120px;
          margin-right: 30px;
        }
        .ktzwRight {
          div {
            font-size: 14px;
            color: #666;
            line-height: 24px;
            &:last-child {
              margin-bottom: 20px;
            }
          }
        }
      }
    }
    &.tlxt {
      .contentMain {
        // display: flex;
        display: block;
        margin-bottom: 20px;
        .main {
          display: flex;
          .voice {
            width: 60px;
            height: 90px;
            margin-right: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .right {
            display: flex;
            & > div {
              display: flex;
              align-items: center;
              margin-right: 20px;
              span {
                margin-right: 5px;
              }
              img {
                width: 120px;
                height: 80px;
              }
            }
          }
        }
        // .voice {
        //   width: 60px;
        //   height: 120px;
        //   margin-right: 20px;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        // }
        // .pictrue {
        //   display: flex;
        //   div {
        //     width: 20px;
        //     height: 120px;
        //     display: flex;
        //     align-items: center;
        //     justify-content: center;
        //   }
        //   img {
        //     width: 180px;
        //     height: 120px;
        //     margin-right: 10px;
        //   }
        // }
      }
    }
    &.tlxd_jz,
    &.tlxd_dh {
      .contentMain {
        margin-bottom: 20px;
        display: block;
        .voice {
          color: #999;
          font-size: 14px;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          height: 40px;
          span {
            margin-right: 20px;
          }
        }
        .tlxd_jzCont {
          display: flex;
          dd {
            width: 260px;
            display: flex;
          }
        }
      }
    }
    &.qjwd {
      .contentMain {
        display: flex;
        .qjwdCont {
          // flex: 1;
          p {
            font-size: 14px;
            color: #666;
            line-height: 24px;
            &.msg {
              margin-bottom: 10px;
            }
          }
          .qjwdContain {
            display: flex;
            font-size: 16px;
            color: #666;
            line-height: 21px;
            margin-bottom: 10px;
            align-items: center;
            span:first-child {
              margin-right: 15px;
            }
            i {
              margin-right: 20px;
            }
          }
        }
      }
    }
    &.htjs {
      .contentMain {
        margin-bottom: 20px;
        div {
          font-size: 14px;
          color: #666;
          line-height: 24px;
        }
      }
    }
    &.tdhtk {
      .contentMain {
        margin-bottom: 20px;
        display: flex;
        img {
          width: 180px;
          height: 120px;
          margin-right: 30px;
        }
        .tdhtkCot {
          // flex: 1;
          .voice {
            height: 40px;
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            span {
              margin-right: 20px;
            }
          }
          .inputs {
            display: flex;
            margin-bottom: 10px;
            .inp {
              margin-right: 10px;
              display: flex;
              align-items: flex-end;
              span {
                margin-right: 5px;
              }
              input {
                height: 0;
                width: 60px;
                border: none;
                outline: none;
                border-bottom: 1px solid #ccc;
              }
            }
          }
        }
      }
    }
    .toolbar {
      position: absolute;
      bottom: 15px;
      left: 25px;
      width: 840px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      background: url("@{image-base-url}/stu/video/expand.png") repeat-x center;
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
  &:last-child {
    margin-bottom: 30px;
  }
  @keyframes replaying {
    0% {
      background-position: 0 0;
    }
    50% {
      background-position: -30px 0;
    }
    75% {
      background-position: -60px 0;
    }
    100% {
      background-position: 0 0;
    }
  }

  .content-block.jszk_tdhxt {
    img {
      width: 120px;
    }
    .left {
      float: left;
      width: 60px;
      height: 90px !important;
      margin-right: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .right {
      float: left;
      display: flex;
      margin-right: 20px;
      align-items: center;
      span {
        margin-right: 5px;
      }
    }
  }
  .content-block.jszk_tdhxt:after {
    display: block;
    clear: both;
    zoom: 1;
  }
  .options{
    p,div{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      vertical-align: bottom;
      width: 92%;
    }
  }
  .pzldc .contentMain >*{
    height: 100%;
  }
}
</style>
