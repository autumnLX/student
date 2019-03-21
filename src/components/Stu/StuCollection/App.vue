<template lang="pug">
	div#StuCollection
		div.StuCollection_container
			div.detectionCover(v-if='!isDetect')
				div.detectionDialog.section
					//- div.detectionDialog-main(v-if='detectStatus === "start"')
						img(src='/static/images/stu/detection/start.png')
						p.f16 {{$t('detection.start.text1')}}
						p.f16 {{$t('detection.start.text2')}}
						button.btn.btn-l.btn-green(@click='startDetection') {{$t('detection.start.btn')}}
					Detection(goBack='detectionComplete')
		router-view(v-if='firstDetectComplete' :handleErrTwice='handleErrTwice')
		Dialog(
			:dialogConfig='wpDCfg'
			:isShowDialog='errTwice'
		)
</template>

<script>
import Detection from '@/components/Stu/StuDetection/detection'
export default {
  name: 'aggregate',
  components: Object.assign({}, { Detection }),
  data () {
    return {
      firstDetectComplete: true,
      isDetect: true,
      detectStatus: 'start', // start detection
      currrentName: '',
      wpDCfg: {
        getCurrentPage: 'WarningPopupRErr',
        icon: '/static/images/practice/exam/ic_frame05.png',
        text1: '抱歉，还是没听清',
        text2: '建议',
        text3: '进行',
        btn1: '设备检测',
        callback1: this.startDetection,
        onHide: this.detectionComplete,
      },
      errTwice: false,
    }
  },
  methods: {
    startDetection() {
      this.isDetect = false
      this.errTwice = false
      this.detectStatus = 'detection'
    },
    detectionComplete() {
      this.isDetect = true
      this.firstDetectComplete = true
    },
    handleErrTwice() {
      this.errTwice = true
    }
  },
  mounted() {
  }
}
</script>

<style lang='less' scoped>
#StuCollection {
  width: 100%;
  min-height: 100vh;
  background-size: cover;
  position: relative;
  display: flex;
  background-repeat: no-repeat;
  background-attachment: fixed;

  .StuCollection_container {
    display: flex;
    flex: 1;
  }

  .detectionCover {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    display: flex;
    align-items: center;
    justify-content: center;

    .detectionDialog {
      width: 500px;
      height: 460px;
      position: relative;
      display: flex;
      // align-items: flex-end;
      justify-content: center;

      .detectionDialog-close {
        width: 30px;
        height: 30px;
        background-image: url(/static/images/stu/detection/btn_close.png);
        position: absolute;
        top: 15px;
        right: 15px;
        cursor: pointer;
      }

      .detectionDialog-main {
        width: 430px;
        height: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
          margin: 30px auto;
        }

        p {
          line-height: 28px;
        }

        button {
          margin-top: 35px;
        }
      }
    }
  }

  &.work {
    background-image: url('/static/images/practice/sky.png');
  }
  &.exam {
    background-image: url('/static/images/practice/sky.png');
  }
}
</style>