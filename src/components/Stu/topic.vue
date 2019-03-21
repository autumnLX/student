<template lang="pug">
  .topic-type
    //视听说视频
    div.content.stssp(v-if="topicParam.topic_type === '16'")
      div.content-slide
        div.pureText-video.row
          video(:src='topicParam.videoUrl' @click='playVideo(topicParam.videoUrl)') 您的浏览器不支持 video 标签。
          i.video-player(@click="playVideo(topicParam.videoUrl)")
          div.left
            ul
              li(v-for='opt in topicParam.detail.topicOption')
                img(:src='$config.resUrl + opt.pictureImgUrl' @click='getLargeImage($config.resUrl + opt.pictureImgUrl)')
        div.reference-answer.footer
          p.short(v-for='(opt, idx) in topicParam.detail.topicOption')
            span.f14.grey9 问题{{idx + 1}}：
            span.text {{opt.topicStem}}
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //短对话理解
    div.content.yc_tdhdt(v-if="topicParam.topic_type === '19' || topicParam.topic_type === '72'")
      div.content-slide
        div.pureText-select
          div.originText
            span.f14.grey6 听力音频：
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
          div.optionlist
            p.topicContent(v-html="topicParam.detail.topicContent")
            ul
              li(v-for='answer in topicParam.detail.topicOption' :title="answer.optionDesc.replace(/<[^>]+>/,'').replace(/&nbsp;/g,' ')")
                span(v-html='`${answer.option}. ${answer.optionDesc}`')
        div.reference-answer.footer
          p
            span.f14.grey9 参考答案：
            span.text(v-for='(opt, index) in topicParam.detail.topicOption')
              span(v-if='opt.isTrue') {{opt.option}}
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //长对话理解
    div.content.yc_tdhdt(v-if="topicParam.topic_type === '20' || topicParam.topic_type === '67' || topicParam.topic_type === '68' || topicParam.topic_type === '69'")
      div.content-slide
        div.pureText-select
          div.originText
            span.f14.grey6 听力音频：
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
          img(v-if="topicParam.topic_type === '68'" :src='$config.resUrl + topicParam.topic_attachment[1].attachmentUrl' style="width:50%;margin-top:6px")
          div.optionlist(v-for='(opt, index) in topicParam.detail.topicOption')
            p.topicContent(v-html="`${index + 1}. ${opt.topicStem}`")
            ul
              li(v-for='answer in opt.options' :title="answer.optionDesc.replace(/<[^>]+>/,'').replace(/&nbsp;/g,' ')")
                span(v-html='`${answer.option}. ${answer.optionDesc}`')
        div.reference-answer.footer
          p
            span.f14.grey9 参考答案：
            span.text(v-for='(opt, index) in topicParam.detail.topicOption') {{index + 1}}.
              span(v-for='answer in opt.options') {{answer.isTrue ? answer.option : ''}}
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    
    //短文理解
    div.content.dwlj(v-if="topicParam.topic_type === '21'")
      div.content-slide
        div.pureText-select
          div.originText
            span.f14.grey6 听力音频：
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
          div.optionlist(v-for='(opt, index) in topicParam.detail.topicOption')
            p.topicContent(v-html="`${index + 1}. ${opt.topicStem}`")
            ul
              li(v-for='answer in opt.options' :title="answer.optionDesc.replace(/<[^>]+>/,'').replace(/&nbsp;/g,' ')")
                span(v-html='`${answer.option}. ${answer.optionDesc}`')
        div.reference-answer.footer
          p
            span.f14.grey9 参考答案：
            span.text(v-for='(opt, index) in topicParam.detail.topicOption') {{index + 1}}.
              span(v-for='answer in opt.options') {{answer.isTrue ? answer.option : ''}}
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //跟读与模仿
    div.content.gdymf(v-if="topicParam.topic_type === '22'")
      div.content-slide
        div.pureText-audio
          div
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
          p.text(v-html='topicParam.detail.topicContent')
        div.reference-answer.footer
          p.short(v-for='(opt, idx) in topicParam.detail.topicOption')
            span.f14.grey9 第{{idx + 1}}句：
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id+idx}" @click='play($config.resUrl + opt.audio.attachmentUrl, topicParam.id+idx)')
            span.text {{opt.topicStem}}
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //朗读 & 短语/句子听读 & 篇章朗读 
    div.content.pzld(v-if="topicParam.topic_type === '23' || topicParam.topic_type === '25' || topicParam.topic_type === '26'" :class="{jztd: topicParam.topic_type === '25'}")
      div.content-slide
        div.pureText-Multiline
          span(v-html='topicParam.detail.topicContent')
        div.reference-answer.footer(v-if='topicParam.audioUrl')
          p
            span.f14.grey9 参考答案：
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //听句子，选择正确答案
    div.content.tydt(v-if="topicParam.topic_type === '27'")
      div.content-slide
        div.pureText-select
          div.originText
            span.f14.grey6 听力音频：
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
          div.optionlist
            div(v-html='topicParam.detail.topicContent')
        div.reference-answer.footer
          p.long
            span.f14.grey9 答案：
            span.text(v-html='topicParam.detail.topicOption[0].optionDesc')
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //看图回答问题
    div.content.kthtwd(v-if="topicParam.topic_type === '28'")
      div.content-slide
        div.row
          img(:src='topicParam.imgUrl' alt='' @click='getLargeImage(topicParam.imgUrl)')
          div.left
            p(v-for='(option, idx) in topicParam.detail.topicOption' :key='idx')
              span.f14.grey6 问题{{idx + 1}}：
              i.replay-icon(:class="{replaying: replayStatus && currentIdx === topicParam.id+idx}" @click="replay(option.audio.attachmentUrl, topicParam.id+idx)")
        div.reference-answer.footer(v-for='(opt, index) in topicParam.detail.topicOption')
          p.long
            span.f14.grey9 参考答案{{index + 1}}：
            span.text(v-html='opt.keyword')
        div.analysis.footer
          p
            span.f14.grey9 解析：
            span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
            span.f14.grey9(v-else) 无
    //听对话，选择正确答案
    div.content.tdhdt(v-if="topicParam.topic_type === '39'")
      div.content-slide
        div.pureText-select
          div.originText
            span.f14.grey6 听力音频：
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
          div.optionlist
            p {{topicParam.detail.topicContent}}
            div(v-html='topicParam.standard_answer')
        div.reference-answer.footer
          p.long
            span.f14.grey9 答案：
            span.text(v-html='topicParam.answer')
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //模仿朗读
    div.content.mfld(v-if="topicParam.topic_type === '40'")
      div.content-slide
        div.pureText-audio
          div
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
          p.text(v-html='topicParam.detail.topicContent')
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //口头作文
    div.content.kthtwd(v-if="topicParam.topic_type === '41'")
      div.content-slide
        div.row(v-if='topicParam.imgUrl')
          img(:src='topicParam.imgUrl' alt='' @click='getLargeImage(topicParam.imgUrl)')
          div.left(v-html='topicParam.detail.topicContent')
        div.row(v-else)
          div(v-html='topicParam.detail.topicContent')
        div.reference-answer.footer
          p.long
            span.f14.grey9 参考答案：
            span.text(v-html='topicParam.standard_answer')
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //看图说单词
    div.content.ktstc(v-if="topicParam.topic_type === '42'")
      div.content-slide
        div.row
          img(:src='topicParam.imgUrl' alt='' @click='getLargeImage(topicParam.imgUrl)')
        div.reference-answer.footer
          p.long
            span.f14.grey9 参考答案：
            span.text(v-html='topicParam.standard_answer')
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //单词朗读 & 读单词
    div.content.ddc.grey6(v-if="topicParam.topic_type === '24' || topicParam.topic_type === '43'")
      div.content-slide
        div.pureText(v-html='topicParam.detail.topicContent')
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //读句子
    div.content.djz.f16.grey6(v-if="topicParam.topic_type === '44'")
      div.content-slide 
        div.pureText(v-html='topicParam.detail.topicContent')
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //对话
    div.content.dh(v-if="topicParam.topic_type === '45'")
      div.content-slide
        div.row
          img(:src='topicParam.imgUrl' alt='' @click='getLargeImage(topicParam.imgUrl)')
          div.left
            p(v-for='(option, idx) in topicParam.detail.topicOption')
              span.f14.grey6 问题{{idx + 1}}：
              i.replay-icon(:class="{replaying: replayStatus && currentIdx === topicParam.id+idx}" @click="replay(option.audio.attachmentUrl, topicParam.id+idx)")
        div.reference-answer.footer(v-for='(opt, index) in topicParam.detail.topicOption')
          p.long
            span.f14.grey9 参考答案{{index + 1}}：
            span.text(v-html='opt.keyword')
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //朗读儿歌
    div.content.ldeg(v-if="topicParam.topic_type === '46'")
      div.content-slide
        div.pureText-audio
          div
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
          p.text(v-html='topicParam.detail.topicContent')
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //听后选择
    div.content.thxz(v-if="topicParam.topic_type === '47'")
      div.content-slide
        div.pureText-select
          div.originText
            span.f14.grey6 听力原文：
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
          div.optionlist(v-for='(opt, index) in topicParam.detail.topicOption')
            p {{index + 1}}.{{opt.topicStem}}
            ul
              li(v-for='answer in opt.options')
                span(v-html='`${answer.option}. ${answer.optionDesc}`')
        div.reference-answer.footer
          p
            span.f14.grey9 参考答案：
            span.text(v-for='(opt, index) in topicParam.detail.topicOption') {{index + 1}}.
              span(v-for='answer in opt.options') {{answer.isTrue ? answer.option : ''}}
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //听后回答
    div.content.thhd(v-if="topicParam.topic_type === '48'")
      div.content-slide
        div.pureText-select
          div.originText
            span.f14.grey6 听力原文：
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
          div.optionlist
            p
              span 问题：
              span(v-html='topicParam.detail.topicContent')
        div.reference-answer.footer
          p.long
            span.f14.grey9 参考答案：
            span.text(v-html='topicParam.answer')
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //听后记录并转述信息
    div.content.thjl(v-if="topicParam.topic_type === '49'")
      div.content-slide
        div.row
          img(:src='topicParam.imgUrl' alt='' @click='getLargeImage(topicParam.imgUrl)')
          div.left
            p
              span.f14.grey6 听力音频：
              i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
            div.quater.quater1
              p 第一节：听后记录
              p 
                span(v-for='(opt, idx) in topicParam.detail.topicOption[0].answerList') {{idx + 1}}._________
            div.quater.quater2
              p 第二节：听后转述信息
              p(v-html='topicParam.detail.topicOption[1].content') 
        div.reference-answer.footer
          p
            span.f14.grey9 参考答案1：
            span.text(v-for='(opt, idx) in topicParam.detail.topicOption[0].answerList')
              span {{idx + 1}}.{{opt}}
        div.reference-answer.footer
          p.long
            span.f14.grey9 参考答案2：
            span.text {{topicParam.detail.audioOriginalText}}
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //短文朗读
    div.content.dwld(v-if="topicParam.topic_type === '50' || topicParam.topic_type === '70'")
      div.content-slide
        div.pureText-Multiline
          span(v-html='topicParam.detail.topicContent')
        div.reference-answer.footer(v-if='topicParam.audioUrl')
          p
            span.f14.grey9 参考答案：
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //听力选图
    div.content.yc_tlxt(v-if="topicParam.topic_type === '51'")
      div.content-slide
        div.pureText-audio(v-for='(topic, i) in topicParam.detail.topicOption')
          div
            span {{i+1}}.
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id + i}" @click='play($config.resUrl + topicParam.detail.topicOption[0].audio.attachmentUrl, topicParam.id + i)')
          div
            ul
              li(v-for='opt in topic.options')
                span {{opt.option}}.
                img(:src='$config.resUrl + opt.optionImgUrl' alt='' @click='getLargeImage($config.resUrl + opt.optionImgUrl)')       
        div.reference-answer.footer
          p
            span.f14.grey9 参考答案：
            span.text(v-for='(opt, index) in topicParam.detail.topicOption')
              span(v-for='answer in opt.options') {{answer.isTrue ? answer.option : ''}} 
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //听力选答
    div.content.yc_tlxd1(v-if="topicParam.topic_type === '52'")
      div.content-slide
        div.pureText-select
          div.originText
            span.f14.grey6 听力原文：
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play($config.resUrl + topicParam.detail.topicOption[0].audio.attachmentUrl, topicParam.id)')
          div.optionlist(v-for='(opt, index) in topicParam.detail.topicOption')
            p {{opt.topicStem}}
            ul
              li(v-for='answer in opt.options')
                span(v-html='`${answer.option}. ${answer.optionDesc}`')
        div.reference-answer.footer
          p
            span.f14.grey9 参考答案：
            span.text(v-for='(opt, index) in topicParam.detail.topicOption')
              span(v-for='answer in opt.options') {{answer.isTrue ? answer.option : ''}}
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //听力选答
    div.content.yc_tlxd2(v-if="topicParam.topic_type === '53'")
      div.content-slide
        div.pureText-select
          div.originText
            span.f14.grey6 听力原文：
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play($config.resUrl + topicParam.detail.topicOption[0].audio.attachmentUrl, topicParam.id)')
          div.optionlist(v-for='(opt, index) in topicParam.detail.topicOption')
            p {{opt.topicStem}}
            ul
              li(v-for='(answer,i) in opt.options') 
                span(v-if="i === 0" ) {{index + 1}}.&nbsp;{{answer.option}}.
                span(v-else) {{answer.option}}.
                span(v-html='answer.optionDesc')
        div.reference-answer.footer
          p
            span.f14.grey9 参考答案：
            span.text(v-for='(opt, index) in topicParam.detail.topicOption')
              span(v-for='answer in opt.options') {{answer.isTrue ? answer.option : ''}}
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //听对话答题
    div.content.yc_tdhdt(v-if="topicParam.topic_type === '54' || topicParam.topic_type === '73'")
      div.content-slide
        div.pureText-select
          div.originText
            span.f14.grey6 听力原文：
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play($config.resUrl + topicParam.detail.topicOption[0].audio.attachmentUrl, topicParam.id)')
          div.optionlist(v-for='(opt, index) in topicParam.detail.topicOption[0].optionList')
            p {{opt.ordering}}.{{opt.topicStem}}
            ul
              li(v-for='answer in opt.options')
                span(v-html='`${answer.option}. ${answer.optionDesc}`')
        div.reference-answer.footer
          p
            span.f14.grey9 参考答案：
            span.text(v-for='(opt, index) in topicParam.detail.topicOption[0].optionList') {{index + 1}}.
              span(v-for='answer in opt.options') {{answer.isTrue ? answer.option : ''}}
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //听对话后填空
    div.content.yc_tdhtk(v-if="topicParam.topic_type === '55'")
      div.content-slide
        div.row
          img(:src='topicParam.imgUrl' alt='' @click='getLargeImage(topicParam.imgUrl)')
          div.left
            p
              span.f14.grey6 听力音频：
              i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
            div.quater.quater1
              p 
                span(v-for='(opt, idx) in topicParam.detail.topicOption[0].answerList') {{idx + 1}}._________
        div.reference-answer.footer
          p
            span.f14.grey9 参考答案：
            span.text(v-for='(opts, index) in topicParam.detail.topicOption[0].answerList')
              span {{index + 1}}.{{opts}}
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //课文朗读
    div.content.yc_dwld(v-if="topicParam.topic_type === '56'")
      div.content-slide
        div.pureText-Multiline
          span(v-html='topicParam.detail.topicContent')
        div.reference-answer.footer(v-if='topicParam.audioUrl')
          p
            span.f14.grey9 参考答案：
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)') 
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //情景问答
    div.content.yc_qjwd(v-if="topicParam.topic_type === '57'")
      div.content-slide
        div.row
          div.left
            div(v-html='topicParam.detail.topicContent')
            p(v-for='(option, idx) in topicParam.detail.topicOption')
              span.f14.grey6 问题{{idx + 1}}：
              i.replay-icon(:class="{replaying: replayStatus && currentIdx === topicParam.id+idx}" @click="replay(option.audio.attachmentUrl, topicParam.id+idx)")
        div.reference-answer.footer(v-for='(opt, index) in topicParam.detail.topicOption')
          p.long
            span.f14.grey9 参考答案{{index + 1}}：
            span.text(v-html='opt.optionDesc')
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //情景问答
    div.content.yc_qjwd(v-if="topicParam.topic_type === '77' || topicParam.topic_type === '82'")
      div.content-slide
        div.row
          div.left
            div.originText(:style="{marginBottom: 15+'px'}")
              span.f14.grey6 听力音频：
              i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
            p(v-for='(option, idx) in topicParam.detail.topicOption')
              span.f14.grey6 问题{{idx + 1}}：
              span {{option.topicStem}}
              i.replay-icon(:class="{replaying: replayStatus && currentIdx === topicParam.id+idx}" @click="replay(option.attachment[0].attachmentUrl, topicParam.id+idx)")
        div.reference-answer.footer(v-for='(opt, index) in topicParam.detail.topicOption')
          p.long
            span.f14.grey9 参考答案{{index + 1}}：
            span.text(v-html='opt.answer')
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //听短对话回答问题
    div.content.js_tdhxt.stc(v-if="topicParam.topic_type === '74'")
      div.content-slide
        div.pureText-select
          div.originText
            span.f14.grey6 听力音频：
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
          div.optionlist
            p {{topicParam.detail.topicOption[0].topicStem}}
            ul
              li(v-for='opt in topicParam.detail.topicOption[0].options')
                span {{opt.option}}.
                span(v-html='opt.optionDesc.replace(/<img([^(src])*src="/g, "$&" + $config.resUrl)')
        div.reference-answer.footer
          p
            span.f14.grey9 参考答案：{{topicParam.answer}}
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //听短文回答问题&听长对话回答问题
    div.content.yc_tdhdt(v-if="topicParam.topic_type === '75' || topicParam.topic_type === '76'")
      div.content-slide
        div.pureText-select
          div.originText
            span.f14.grey6 听力音频：
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
          div.optionlist(v-for='(opt, idx) in topicParam.detail.topicOption')
            p
              span {{opt.ordering}}.{{opt.topicStem}}
              i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id+idx}" @click="play($config.resUrl + opt.attachment[0].attachmentUrl, topicParam.id+idx)")
            ul
              li(v-for='answer in opt.options')
                span(v-html='`${answer.option}. ${answer.optionDesc}`')
        div.reference-answer.footer
          p
            span.f14.grey9 参考答案：
            span.text(v-for='(opt, index) in topicParam.detail.topicOption') {{index + 1}}.
              span(v-for='answer in opt.options') {{answer.isTrue ? answer.option : ''}}
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //话题简述
    div.content.yc_htjs(v-if="topicParam.topic_type === '58' || topicParam.topic_type === '78' || topicParam.topic_type === '83'")
      div.content-slide
        div.pureText-select
          div.originText(:style="{marginBottom: 15+'px'}" v-show="topicParam.topic_type === '78'")
            span.f14.grey6 听力音频：
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
          div.pureText-Multiline(v-html='topicParam.detail.topicContent')
        div.reference-answer.footer
          p.long
            span.f14.grey9 参考答案：
            span.text(v-html='topicParam.teacher_answer')
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //听独白，完成信息记录表
    div.content.yc_tdhtk(v-if="topicParam.topic_type === '81'")
      div.content-slide
        div.row
          img(:src='topicParam.imgUrl' alt='' @click='getLargeImage(topicParam.imgUrl)')
          div.left.pureText-select
            div.optionlist(v-for='(opt, idx) in topicParam.detail.topicOption' :style="{marginBottom: 10+'px'}")
              ul
                li(v-for='(answer,i) in opt.options')
                  span(v-if="i === 0" ) {{opt.ordering}}.&nbsp;{{answer.option}}.
                  span(v-else) {{answer.option}}.
                  span(v-html='answer.optionDesc')
        div.reference-answer.footer
          p
            span.f14.grey9 参考答案：
            span.text(v-for='(opts, index) in topicParam.answer.split(",")')
              span {{index + 1}}.{{opts}}
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //听对话，选图片
    div.content.js_tdhxt.stc(v-if="topicParam.topic_type === '79'")
      div.content-slide
        div.pureText-select
          div.originText
            span.f14.grey6 听力音频：
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
          div.optionlist
            p {{topicParam.detail.topicOption[0].topicStem}}
            ul
              li(v-for='opt in topicParam.detail.topicOption[0].options')
                span {{opt.option}}.
                span
                  img(:src='$config.resUrl + opt.attachment[0].attachmentUrl' alt='')
        div.reference-answer.footer
          p
            span.f14.grey9 参考答案：{{topicParam.answer}}
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //江苏听对话选图
    div.content.js_tdhxt.stc(v-if="topicParam.topic_type === '65'")
      div.content-slide
        div.pureText-select
          div.originText
            span.f14.grey6 听力音频：
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
          div.optionlist
            p {{topicParam.detail.topicContent}}
            ul
              li(v-for='opt in topicParam.detail.topicOption')
                span {{opt.option}}.
                span(v-html='opt.optionDesc')
        div.reference-answer.footer
          p
            span.f14.grey9 参考答案：{{topicParam.answer}}
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //江苏听对话回答问题
    div.content.js_tdhxt.stc(v-if="topicParam.topic_type === '66'")
      div.content-slide
        div.pureText-select
          div.originText
            span.f14.grey6 听力音频：
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
          div.optionlist
            p {{topicParam.detail.topicContent}}
            ul
              li(v-for='opt in topicParam.detail.topicOption')
                span {{opt.option}}.
                span(v-html='opt.optionDesc.replace(/<img([^(src])*src="/g, "$&" + $config.resUrl)')
        div.reference-answer.footer
          p
            span.f14.grey9 参考答案：{{topicParam.answer}}
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //沈阳情景问答
    div.content.sy_thhd(v-if="topicParam.topic_type === '71'")
      div.content-slide
        div.pureText-select
          div.originText
            span.f14.grey6 听力音频：
            i.play-icon(:class="{playing: playStatus && currentIdx === topicParam.id}" @click='play(topicParam.audioUrl, topicParam.id)')
          div.optionlist
            ul
              li(v-for='(opt,index) in topicParam.detail.topicOption') 问题{{index+1}}: {{opt.questionText}}
        div.reference-answer.footer
          p 参考答案:
          ul
              li(v-for='(opt,index) in topicParam.detail.topicOption')
                span 问题{{index+1}}: 
                span(v-html='opt.optionDesc')
        div.analysis.footer
          span.f14.grey9 解析：
          span.f14.grey9(v-if='topicParam.analysis' v-html='topicParam.analysis')
          span.f14.grey9(v-else) 无
    //视频播放
    div.videoTag(v-if='showVideoPlayer')
      div.video-content
        video(:src='videoUrl' controls="controls" autoplay="autoplay") 您的浏览器不支持 video 标签。
        i.videoCancle(@click='closeVideo()')
    //大图预览
    div.viewLargeImage(v-if='largeImage' @click='closeLargeImage()')
        img(:src='largeImage' @click='closeLargeImage()')
</template>

<script>
export default {
  name: 'Topic',
  props: ['topicParam', 'player', 'doPlay', 'currentId', 'getCurrentId'],
  data () {
    return {
      playStatus: false,
      replayStatus: false,
      showVideoPlayer: false,
      videoUrl: '',
      currentIdx: this.currentId,
      largeImage: ''
    }
  },
  filters: {
    replaceImg (msg) {
      return msg.replace(/(<img[\s\S]*)src=['"]([^'"]+)[.]*/g, '$1src="' + this.$config.resUrl + '$2')
    }
  },
  methods: {
    play (url, id) {
      console.log(url)
      if (this.currentIdx === '') {
        this.player.stop()
        this.getCurrentId(id)
        this.playStatus = true
        this.doPlay(url, () => {
          this.getCurrentId('')
          this.playStatus = false
        })
      } else {
        if (this.currentIdx === id) {
          this.getCurrentId('')
          this.playStatus = false
          this.player.stop()
        } else {
          this.player.stop()
          setTimeout(() => {
            this.playStatus = true
            this.currentIdx = id
            this.getCurrentId(id)
            this.doPlay(url, () => {
              this.getCurrentId('')
              this.playStatus = false
            })
          }, 500)
        }
      }
    },
    replay (url, id) {
      let _url = ''
      if (url.indexOf('http') < 0) {
        _url = `${this.$config.resUrl}${url}`
      } else {
        _url = url
      }
      if (this.currentIdx === '') {
        this.player.stop()
        this.getCurrentId(id)
        this.replayStatus = true
        this.doPlay(_url, () => {
          this.getCurrentId('')
          this.replayStatus = false
        })
      } else {
        if (this.currentIdx === id) {
          this.getCurrentId('')
          this.replayStatus = false
          this.player.stop()
        } else {
          this.player.stop()
          setTimeout(() => {
            this.replayStatus = true
            this.currentIdx = id
            this.getCurrentId(id)
            this.doPlay(_url, () => {
              this.getCurrentId('')
              this.replayStatus = false
            })
          }, 500)
        }
      }
    },
    playVideo (url) {
      this.showVideoPlayer = true
      this.videoUrl = url
      this.player && this.player.stop()
    },
    closeVideo () {
      this.showVideoPlayer = false
    },
    getLargeImage (url) {
      this.largeImage = url
    },
    closeLargeImage () {
      this.largeImage = ''
    },
    handleTopicData () {
      // const igonire = ['65', '66', '67', '68', '69', '70']
      this.topicParam.topic_attachment = typeof this.topicParam.topic_attachment === 'string' ? JSON.parse(this.topicParam.topic_attachment) : this.topicParam.topic_attachment
      this.topicParam.detail = typeof this.topicParam.detail === 'string' ? JSON.parse(this.topicParam.detail.replace(/<img([^(src])*src=\\"/g, '$&' + this.$config.resUrl)) : this.topicParam.detail
      // if (igonire.includes(this.topicParam.topic_type)) {
      //   return
      // }
      console.log(this.topicParam)
      if (this.topicParam.teacher_answer) { // 答案用|分隔
        const teacher_answer = this.topicParam.teacher_answer.replace(/#/g, '&nbsp;&nbsp;|&nbsp;&nbsp;').replace(/\//g, '&nbsp;&nbsp;|&nbsp;&nbsp;')
        this.$set(this.topicParam, 'teacher_answer', teacher_answer)
      }
      if (this.topicParam.standard_answer) {
        if (this.topicParam.topic_type !== '39') {
          const standard_answer = this.topicParam.standard_answer.replace(/#/g, '&nbsp;&nbsp;|&nbsp;&nbsp;').replace(/\//g, '&nbsp;&nbsp;|&nbsp;&nbsp;')
          this.$set(this.topicParam, 'standard_answer', standard_answer)
        }
      }
      if (this.topicParam.answer) {
        const answer = this.topicParam.answer.replace(/#/g, '&nbsp;&nbsp;|&nbsp;&nbsp;').replace(/\//g, '&nbsp;&nbsp;|&nbsp;&nbsp;')
        this.$set(this.topicParam, 'answer', answer)
      }
      if (this.topicParam.topic_type === '49' || this.topicParam.topic_type === '55') { // 听后记录并转述&听对话后填空小题数据转换
        const answerList = this.topicParam.detail.topicOption[0].fillAnswer.split('#')
        this.$set(this.topicParam.detail.topicOption[0], 'answerList', answerList)
      }
      if (this.topicParam.topic_attachment) { // 拼接音频、视频或者图片全路径
        // this.topicParam.topic_attachment = typeof this.topicParam.topic_attachment === 'string' ? JSON.parse(this.topicParam.topic_attachment) : this.topicParam.topic_attachment
        if (this.topicParam.topic_attachment.length) {
          this.topicParam.topic_attachment.forEach((value, idx) => {
            if (value.attachmentUrl.indexOf('.mp3') >= 0) {
              this.$set(this.topicParam, 'audioUrl', this.$config.resUrl + value.attachmentUrl)
            } else if (value.attachmentUrl.indexOf('.png') >= 0 || value.attachmentUrl.indexOf('.jpg') >= 0 || value.attachmentUrl.indexOf('.jpeg') >= 0) {
              this.$set(this.topicParam, 'imgUrl', this.$config.resUrl + value.attachmentUrl)
            } else if (value.attachmentUrl.indexOf('.mp4') >= 0) {
              this.$set(this.topicParam, 'videoUrl', this.$config.resUrl + value.attachmentUrl)
            }
          })
        }
      }
      if (this.topicParam.detail) {
        if (this.topicParam.detail.topicContent) {
          if (['27', '58', '78'].indexOf(this.topicParam.topic_type) < 0) {
            const topicContent = this.topicParam.detail.topicContent.replace(/<(?!img)[^>]+>/g, '')
            this.$set(this.topicParam.detail, 'topicContent', topicContent)
          }
        }
        if (this.topicParam.detail.topicOption && this.topicParam.detail.topicOption.length) {
          this.topicParam.detail.topicOption.forEach((value, index) => {
            if (value && value.keyword) {
              const keyword = value.keyword.replace(/#/g, '&nbsp;&nbsp;|&nbsp;&nbsp;')
              this.$set(this.topicParam.detail.topicOption[index], 'keyword', keyword)
            }
            if (value && value.optionDesc) {
              const optionDesc = value.optionDesc.replace(/<(?!img)[^>]+>/g, '').replace(/#/g, '&nbsp;&nbsp;|&nbsp;&nbsp;')
              this.$set(this.topicParam.detail.topicOption[index], 'optionDesc', optionDesc)
            }
            if (value && value.topicStem) {
              const topicStem = value.topicStem.replace(/<(?!img)[^>]+>/g, '')
              this.$set(this.topicParam.detail.topicOption[index], 'topicStem', topicStem)
            }
            if (value.options && value.options.length) { // 去除html标签
              value.options.forEach((opt, i) => {
                const optionDesc = opt.optionDesc && opt.optionDesc.replace(/<(?!img)[^>]+>/g, '')
                this.$set(this.topicParam.detail.topicOption[index].options[i], 'optionDesc', optionDesc)
              })
            }
          })
        }
      }
    },
  },
  watch: {
    topicParam: function (val) {
      this.handleTopicData()
    },
    currentId: function (val) {
      this.currentIdx = this.currentId
    }
  },
  beforeMount () {
    this.handleTopicData()
  }
}
</script>

<style lang='less' scoped>
@image-base-url: "../../assets/image/stu";
.expand {
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
    line-height: 100% !important;
  }
}
.content {
  display: flex;
  margin: 0 auto 20px;
  width: 780px;

  & > div.content-slide {
    height: 90px;
    overflow: hidden;

    .row {
      position: relative;

      & > img {
        width: 180px;
        height: 120px;
        margin-right: 30px;
        cursor: pointer;
      }

      & > .left {
        position: absolute;
        top: 0;
        left: 210px;
        width: 645px;

        & > p {
          line-height: 40px;
          position: relative;

          & > .replay-icon {
            display: inline-block;
            position: relative;
            top: 8px;
            margin-left: 15px;
            width: 30px;
            height: 30px;
            background: url("@{image-base-url}/video/icon_audiogroups.png")
              no-repeat center;
            background-position: 0 0;
            cursor: pointer;

            &:hover {
              background: url("@{image-base-url}/video/icon_audiogroups.png")
                no-repeat center;
              background-position: 0 -30px;
            }
            &.replaying {
              background: url("@{image-base-url}/video/icon_audiogroups.png")
                no-repeat center;
              background-position: -30px 0;

              &:hover {
                background: url("@{image-base-url}/video/icon_audiogroups.png")
                  no-repeat center;
                background-position: -30px -30px;
              }
            }
          }
        }
      }
    }

    .pureText {
      height: 90px;
      line-height: 90px;

      & ul {
        margin-top: 10px;
        display: flex;

        & li {
          flex: 1;
        }
      }
    }
    .pureText-Multiline {
      min-height: 90px;
      & span {
        line-height: 18px;
      }
    }
    .pureText-audio {
      min-height: 90px;
      & > div {
        float: left;
        width: 60px;
        height: 90px;

        & i {
          display: block;
          top: 50%;
          margin-top: -15px;
        }

        & > ul {
          width: 550px;
          li {
            float: left;
            padding-left: 20px;
            margin-left: 20px;
            height: 80px;
            position: relative;
            & span {
              position: absolute;
              top: 0;
              left: 0;
              width: 20px;
              height: 80px;
              line-height: 80px;
            }
            & img {
              display: inline-block;
              width: 120px;
              height: 80px;
              cursor: pointer;
            }
            &:first-child {
              margin-left: 10px;
            }
          }
        }
      }
      & p {
        line-height: 18px;
        float: left;
        width: 700px;
        margin-left: 20px;
      }
    }

    .pureText-video {
      min-height: 90px;
      position: relative;
      & > div {
        float: left;
        width: 60px;
        height: 90px;

        & i {
          display: block;
        }
      }
      & p {
        line-height: 18px;
        float: left;
        width: 700px;
        margin-left: 20px;
      }
      & > video {
        object-fit: fill;
        width: 180px;
        height: 120px;
        cursor: pointer;
        display: inline-flex;
      }
      & > .video-player {
        position: absolute;
        width: 52px;
        height: 52px;
        top: 29px;
        left: 64px;
        cursor: pointer;
        background: url("@{image-base-url}/icon_videoplay.png") no-repeat center;
      }
    }
    .pureText-select {
      min-height: 90px;

      div.originText {
        display: block;
        line-height: 100%;
      }
      div.optionlist {
        margin-top: 15px;

        & > ul {
          margin-top: 5px;
        }
      }

      ul {
        display: flex;

        li {
          flex: 1;
          width: 25%;
          display: flex;

          & > span {
          }
          &:nth-child(2),
          &:nth-child(3) {
            padding-left: 10px;
          }
        }
      }
    }
  }

  .text {
    line-height: 24px;
  }
}

.footer {
  width: 780px;
  min-height: 40px;
  line-height: 40px;
  margin: 20px auto 0;
  position: relative;

  & > span {
    &:first-child {
      float: left;
    }
    &:last-child {
      display: inherit;
    }
  }
}

.reference-answer {
  & > p {
    line-height: 18px;
    position: relative;
    & > span {
      &.text {
        padding-left: 10px;
      }
    }

    &.long,
    &.short {
      & > span {
        &:first-child {
          position: absolute;
          left: 0;
          top: 3px;
        }
        &.text {
          display: block;
        }
      }
    }

    &.long {
      & > span:first-child {
        width: 80px;
      }
      & > span:last-child {
        padding-left: 80px;
      }
    }

    &.short {
      & > span:first-child {
        width: 60px;
      }
      & > span:last-child {
        padding-left: 60px;
      }
    }
  }
}

i.play-icon {
  display: inline-block;
  position: relative;
  top: 8px;
  width: 30px;
  height: 30px;
  margin-left: 20px;
  background: url("@{image-base-url}/video/listening.png") no-repeat center;
  background-position: -60px 0;
  cursor: pointer;

  &.playing {
    animation: playing 1s steps(1) infinite 0s;
    -moz-animation: playing 1s steps(1) infinite 0s;
    -webkit-animation: playing 1s steps(1) infinite 0s;
    -o-animation: playing 1s steps(1) infinite 0s;
  }
}

.ddc .pureText {
  font-size: 36px;
}

.tydt,
.tdhdt {
  .optionlist {
    & > div {
      padding-top: 15px;
      & > ul {
        padding-left: 15px;
        li {
          padding-left: 10px;
        }
      }
    }
  }
  .reference-answer.footer {
    p.long {
      & > span:last-child {
        padding-left: 45px;
      }
    }
  }
}
.jztd {
  .long {
    & > i {
      top: -4px;
      margin-left: 80px;
    }
  }
}
.thjl,
.yc_tdhtk {
  .quater {
    & > p {
      & > span {
        margin-left: 20px;

        &:nth-child(1) {
          margin-left: 0;
        }
      }
    }
    & > p:nth-child(2) {
      margin-top: 5px;
    }
  }
  .quater2 {
    margin-top: 10px;
  }
}

.stssp {
  width: 100%;
  .content-slide {
    width: 100%;
  }
  & video {
    position: absolute;
    left: 0;
    top: 0;
  }
  .left {
    display: inline-flex;
    float: initial !important;
    margin-left: 210px;
    position: relative !important;
    left: 0 !important;
    top: 0 !important;
    height: 100% !important;
    min-height: 120px;
    & ul {
      width: 645px;
      min-height: 90px;
      li {
        display: inline-block;
        height: 80px;
        width: 120px;
        margin-left: 5px;
        & > img {
          display: block;
          width: 120px;
          height: 80px;
          cursor: pointer;
        }
      }
    }
  }

  .reference-answer {
    margin-top: 10px;

    &:first-child {
      margin-top: 20px;
    }
  }
}

.yc_qjwd {
  .left {
    position: relative !important;
    left: 0 !important;
    top: 0 !important;
  }
}
.yc_tlxt {
  .pureText-audio {
    & > div {
      float: initial;
      margin-left: 60px;
      position: relative;
      &:nth-child(1),
      &:nth-child(2) {
        float: left;
        margin: 0;
      }
      & > span {
        position: absolute;
        top: 30px;
        left: 5px;
      }
      & > i {
        top: 39px !important;
      }
    }
  }
}
.gdymf {
  .reference-answer.footer {
    & > p.short {
      & > i {
        top: -3px;
        margin-left: 55px;
      }
      & > span {
        &:last-child {
          display: inline;
          padding-left: 15px;
          position: relative;
          top: -13px;
        }
      }
    }
  }
}
.videoTag {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  & > .video-content {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 660px;
    height: 440px;
    margin: -270px 0 0 -330px;
    border-radius: 10px;
    position: relative;

    & > video {
      object-fit: fill;
      width: 100%;
      height: 100%;
    }
    & > .videoCancle {
      display: block;
      position: absolute;
      right: -60px;
      top: -30px;
      width: 40px;
      height: 40px;
      cursor: pointer;
      background: url("@{image-base-url}/icon_videocancle.png") no-repeat center;
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
.sy_thhd {
  ul {
    display: block !important;
  }
  li {
    padding: 0 !important;
    line-height: 30px;
    font-size: 14px;
  }
}

@keyframes playing {
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
</style>
<style lang="less">
.js_tdhxt.stc p {
  display: inline;
}
.js_tdhxt.stc img {
  width: 100px;
}
.topic-type .topicContent {
  // display: flex;
  // align-items: end;
  img {
    width: 180px;
    vertical-align: top;
  }
  p img{
    display: block;
  }
}
.content > div.content-slide .pureText-select ul li {
  img {
    width: 100%;
  }
  span {
    // display: flex!important;
    // align-items: start!important;
    white-space: normal!important;
  }
}
</style>
