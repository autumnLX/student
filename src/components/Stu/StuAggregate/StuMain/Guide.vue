<template lang="pug">
  div#guide
    div#player
    div#content
      // div#aiPanel.aiPanel(style='{height:50px}')
      //   div
      //     button.play
      //     button.record
      //     button.replay
      //     div.recordProgressBar
      //       div.value
      // p#scoreResult 
      //   |综合得分：
      //   span.class
      //   br
      //   br
      //   |流利度：
      //   span.fluency
      //   br
      //   |完整度：
      //   span.integrity
      //   br
      //   |单词发音：
      //   span.details
    div#aiMediaDialogOverlay.aiMediaDialogOverlay
    div#aiMediaDialog.aiMediaDialog
      div.dialogTitle 设置面板
        button.dialogCloseButton X
      div.dialogFlashError
        p.flashVersion.hidden 您电脑的Flash版本过低，请点击此链接升级。 
          br
          a(href="http://get.adobe.com/flashplayer/" target="_blank") 点击下载最新Flash版本
        p.flashPlugin.hidden 您的电脑没有安装或者禁用Flash插件，请确认。
          br
          a(href="http://get.adobe.com/flashplayer/" target="_blank") 点击下载最新Flash版本
      div.dialogBody
        div#recorder
      div.dialogInfo
        h5 状态信息
        ul
          li.loadFlashPlayer.hidden
            span.info 正在下载Flash播放器...
          li.loadFlashRecorder.hidden 
            span.info 正在下载Flash录音机...
          li.connectServerInit.hidden
            span.error 还没有连接录音服务器
          li.connectServerStart.hidden 
            span.info 正在连接录音服务器，请稍候...
          li.connectServerSuccess.hidden 
            span.success 连接录音服务器成功
          li.connectServerError.hidden 
            span.error 连接录音服务器失败，请
              a(href='javascript:aiPanel.recorder.reconnect();') 重试
          li.micStatusAllow.hidden 
            span.success Flash可以访问麦克风
          li.micStatusDisallow.hidden 
            span.error Flash不能访问麦克风，请设置
          li.micStatusError.hidden 
            span.error 没有找到录音设备，请检查
          li.mmscfgError.hidden
            span.error Flash被禁止访问麦克风，请手动删除 mms.cfg文件，然后重试
      div.dialogButton
        button.okButton 确定
</template>

<script>
export default {
  name: 'Guide',
}
</script>

<style lang='less' scoped>
#aiMediaDialog #recorder {
	top: 350px;
	left: 50px;
	width: 398px;
	height: 298px;
}

#aiMediaDialog #recorder.normal {
	width: 220px;
	height: 140px;
}

#aiMediaDialog #recorder.min {
	width: 1px;
	height: 1px;
}
</style>

