<template lang="pug">
  KmDialog(:visible.sync="visible" :hiddenLayer="true" @close="close_jyzd")
    div.zd_title(slot="title")
      span 纠音指导
      img.zd_img(src='/static/images/tip_close.png' v-if="jyzd_tip")
    div.scroll(slot="body")
      vue-scroll
        div.warp.jyzd
          span.word {{result.details.word[0].name}}
            b(@click.self="palyAudio(result.audio)")
          p.score 
            span 得分:
            i(:class="[score_color]") &ensp;{{result.score}}
          p.label
            span 参考:&ensp;
            span.phn {{`[${symbol}]`}}
          p.rec
            span 你的:
            span.phn(v-html="`&ensp;[${phns}]`" :class="[score_color]")
            i(@click.self="palyAudio(audiourl)")
          div.errors
            p.err(v-show="errors[0].length") {{errors[0].join('，')}}，需要注意哦！
            p.err(v-show="errors[1].length") {{errors[1].join('，')}}，是易混淆音，请注意区分~
            p.err(v-show="errors[2].length") {{errors[2].join('，')}}，有明显的区别哦，请注意区分~
          div.explain(v-if="confuseVideoList.length")
            p 易混淆发音
            div.yixunxiao(v-for="(detail, index) in confuseVideoList")
              p {{ detail.leftDescription }}
              p {{ detail.rightDescription }}
              div.bo_img
                div(v-show="detail.soundWaveImg.left")
                  span {{ detail.leftContent }}
                  img(:src="detail.soundWaveImg.left")
                div(v-show="detail.soundWaveImg.right")
                  span {{ detail.rightContent }}
                  img(:src="detail.soundWaveImg.right")
          div.explain
            p 详细解说
            div(v-for="(detail, index) in videoSourceList")
              h4 [{{detail.content}}]
              p {{ detail.description }}
              div.video(v-if="detail.video")
                video(:src="detail.video[0]" controls @play="playHandle")
                video(:src="detail.video[1]" controls @play="playHandle")
          km-button.zd_button(slot="footer" :isBack="true" @click="close_jyzd") 我知道了
</template>

<script>
import { KmDialog, KmButton } from '@/ui'
import mock from './mock.js'
import Translations from './Topic/Translation'
import symbols1 from './symbols1.js'
import symbols2 from './symbols2.js'
export default {
  data () {
    return {
      visible: false,
      jyzd_tip: false,
      videoList: [],
      videoSourceList: [],
      confuseVideoList: [],
      audio: null,
      phns: '',
      errors: { 0: [], 1: [], 2: [] },
      confuseList: new Set(),
      mistakList: new Set(),
      symbol: ''
    }
  },
  components: { KmDialog, KmButton },
  props: {
    result: {
      type: Object,
      default () {
        return mock
      }
    }
  },
  methods: {
    playHandle () {
      this.stop(event.target)
    },
    stop (e) {
      if (this.audio) this.audio.pause()
      const eles = this.videoList.filter(ele => ele !== e)
      eles.forEach(ele => ele.pause())
    },
    palyAudio (audio) {
      const target = event.target
      if (!audio) { this.$alert('未找到标准音频'); return }
      if (target.classList.contains('playing')) {
        this.audio.pause()
      } else {
        this.stop()
        target.classList.add('playing')
        this.audio = new Audio(audio)
        this.audio.onpause = () => {
          target.classList.remove('playing')
        }
        this.audio.play()
      }
    },
    createSpan (type, phn) {
      this.phns += `<span class="${type}">${phn}</span>`
    },
    pass (phn) {
      this.createSpan('perfect', phn)
    },
    err_1 (phn) {
      // 多读
      this.addToMistakList(phn)
      this.createSpan('bad', phn)
    },
    err_2 (phn) {
      // 少读
      this.addToMistakList(phn)
      this.createSpan('miss good', phn)
    },
    err_3 (lab, rec) {
      this.addToMistakList(lab)
      this.addToMistakList(rec)
      this.createSpan('bad', rec)
      const id = symbols2.get(`${lab}&${rec}`) || symbols2.get(`${rec}&${lab}`)
      if (id) {
        this.errors[1].push(`[${lab}]和[${rec}]`)
        this.confuseList.add(id)
      } else {
        this.errors[2].push(`[${lab}]和[${rec}]`)
      }
    },
    addToMistakList (phn) {
      const id = symbols1.get(phn)
      id && this.mistakList.add(id)
    },
    position (index, type, last, lab, rec) {
      let position
      if ((type === 2 && index === 0) || (type === 1 && index === -1)) {
        position = '前面'
      } else if (index >= last) {
        position = '末尾'
      } else {
        position = '中间'
      }
      this.errors[0].push(`${position}${type === 1 ? '多' : '少'}发了一个[${lab || rec}]的音`)
    },
    chuli () {
      let lab, rec
      const last = this.word.lab.split(' ').length - 1
      let realIndex = -1;
      this.phn.forEach((phn, index) => {
        lab = phn.lab === '#' ? '' : Translations.translation.get(phn.lab) || phn.lab
        rec = phn.rec === '#' ? '' : Translations.translation.get(phn.rec) || phn.rec
        this.symbol += lab
        // 过滤掉前面多读的音素
        if (lab) realIndex++
        switch (phn.is_err) {
          case 0: this.pass(rec); break;
          case 1: this.position(realIndex, 1, last, rec); this.err_1(rec); break;
          case 2: this.position(realIndex, 2, last, lab); this.err_2(lab); break;
          case 3: this.err_3(lab, rec); break;
          default: this.err_3(lab, rec); break;
        }
      })
      this.getData()
    },
    getData () {
      const ConfusedIds = [...this.confuseList].join(',')
      const mistakIds = [...this.mistakList].join(',')
      ConfusedIds && this.$ajax.get('/InitResource/getConfusedSymbolInfo', {
        id: ConfusedIds
      }, (res) => {
        if (res.status === 1) {
          this.confuseVideoList = this.confuseVideoList.concat(res.data)
        }
      })
      mistakIds && this.$ajax.get('/InitResource/getSymbolInfo', {
        id: mistakIds
      }, (res) => {
        if (res.status === 1) {
          const _arr = res.data
          const yy = {}
          _arr.forEach(i => {
            yy[i.id] = i
          })
          this.videoSourceList = []
          mistakIds.split(',').forEach(i => {
            this.videoSourceList.push(yy[i])
          })
          this.$nextTick(() => {
            this.videoList = Array.from(document.querySelectorAll('video,audio'))
          })
        }
      })
    },
    checkCustomTagAlert (callback) {
      this.$ajax.post('/students/checkCustomTagAlert', {
        tag: 'jyzd_tip1'
      }, (res) => {
        if (res.status === 1) {
          if (res.data === 1) {
            this.jyzd_tip = false
          } else {
            this.jyzd_tip = true
          }
        }
      })
    },
    close_jyzd () {
      this.jyzd_tip = false
      this.visible = false
      if (this.jyzd_tip) {
        this.$ajax.post('/students/addCustomTagAlert', {
          tag: 'jyzd_tip1'
        }, (res) => {

        })
      }
    }
  },
  computed: {
    score_color () {
      const score = this.result.score
      const level = this.$config.ScoreLevel
      if (score >= level.good) {
        return 'perfect'
      } else if (score >= level.bad) {
        return 'good'
      } else {
        return 'bad'
      }
    },
    audiourl () {
      return this.result.audioUrl ? `http://${this.result.audioUrl.replace(/:8002/, '')}.mp3` : ''
    },
    word () {
      return this.result.details.word[0]
    },
    phn () {
      return this.result.details.word[0].phn || []
    }
  },
  watch: {
    result () {
      this.visible = true
      this.videoList = []
      this.videoSourceList = []
      this.confuseVideoList = []
      this.audio = null
      this.phns = ''
      this.errors = { 0: [], 1: [], 2: [] }
      this.symbol = ''
      this.confuseList.clear()
      this.mistakList.clear()
      this.chuli()
    }
  },
  mounted () {
    this.checkCustomTagAlert()
  }
}
</script>

<style lang="less" scoped>
.scroll {
  height: 100%;
  width: 1200px;
  padding-left: 120px;
  padding-right: 15px;
}
.warp {
  padding-right: 105px;
  margin-top:40px; 
}
.word {
  font-size: 24px;
  line-height: 40px;
  color: #333;
}
.score {
  margin-top: 5px;
  span {
    font-size: 14px;
    color: #666;
    line-height: 30px;
    vertical-align: top;
  }
  i {
    font-style: normal;
    font-size: 24px;
    line-height: 30px;
  }
}
.explain {
  margin-top: 20px;
  > p {
    line-height: 30px;
    font-size: 16px;
    color: #333;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
  }
  > p::before {
    display: inline-block;
    content: '';
    width: 4px;
    height: 16px;
    background: #21bd73;
    margin-right: 5px;
  }
  > div p {
    font-size: 14px;
    color: #666;
    line-height: 24px;
  }
  h4{
    font-size: 18px;
    color:#666;
    font-weight: bold;
    line-height: 30px;
  }
}
.video {
  margin-top: 10px;
  margin-bottom: 20px;
}
video {
  height: 160px;
}
video:first-child {
  margin-right: 40px;
}
.rec .phn {
  color: #21bd73;
}
.label,
.rec {
  display: flex;
  align-items: center;
  margin-top: 5px;
  .phn {
    font-size: 16px;
    span {
      font-size: 16px;
    }
  }
}
.word b,
.rec i {
  display: inline-block;
  width: 20px;
  height: 16px;
  margin-left: 10px;
  cursor: pointer;
  background: url('/static/images/ico_voice_normal.png') no-repeat;
}
.word b.playing,
.rec i.playing {
  background: url('/static/images/ico_voice_play.gif') no-repeat;
}
.errors {
  margin-top: 10px;
  .err {
    font-size: 14px;
    line-height: 24px;
    color: #666;
  }
}
.bo_img {
  margin-top: 10px;
  display: flex;
  div:last-child {
    margin-left: 50px;
  }
  span {
    font-size: 16px;
    color: #333;
  }
  img {
    height: 60px;
    margin-left: 10px;
    vertical-align: middle;
  }
}
.yixunxiao {
  margin-top: 20px;
}
.yixunxiao:first-of-type {
  margin-top: 0;
}
</style>
<style lang="less">
.jyzd.warp {
  .perfect {
    color: #21bd73;
  }
  .good {
    color: #999;
  }
  .bad {
    color: #ff6666;
  }
  .miss {
    border: 1px dotted #ccc;
    background: #f8f8f8;
    padding: 0 2px;
  }
}
#MainBoard .zd_button {
  margin: 30px 0 70px 0;
}
#MainBoard .zd_title {
  height: 80px;
  background: #24cc7c;
  text-align: center;
  width: 100%;
  span {
    font-size: 24px;
    line-height: 80px;
    color: white;
  }
}
#MainBoard .layer .content {
  height: 100%;
  padding: 0;
  top: 0;
  transform: translate(-50%, 0);
  background: rgba(255, 255, 255, 0.95);
}
#MainBoard .layer .close {
  right: 30px;
  top: 26px;
  font-size: 24px;
  color: white;
}
#MainBoard .layer .close:hover {
  color: white;
}
#MainBoard .layer .zd_img {
  position: absolute;
  top: 54px;
  right: 10px;
}
#MainBoard .phn span {
  font-size: 16px;
}
</style>

