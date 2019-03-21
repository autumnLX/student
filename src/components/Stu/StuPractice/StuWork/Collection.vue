<template lang="pug">
  #collection
    i.icon_collection(:class="{show: inVocab}" @click='collection()')
</template>

<script>
export default {
  name: 'StuWorkCollection',
  props: ['data', 'work', 'type'],
  data () {
    return {
      request: {
      },
      vocabId: '',
      inVocab: false
    }
  },
  methods: {
    handleData() {
      this.inVocab = this.data.inVocab
      this.vocabId = this.data.vocabId ? this.data.vocabId : ''
      this.request.bookId = this.work.bookId || ''
      this.request.unitId = this.work.unitId || ''
      this.request.sectionId = this.work.sectionId || ''
      this.request.practiceType = this.work.practiceType || ''
      this.request.content = this.data.content || ''
      this.request.resId = this.data.id
      this.request.word = JSON.stringify(this.data)
    },
    insertOneVocab() {
      let contentType = ''
      switch (this.type) {
        case 'word':
          contentType = 1;
          break;
        case 'sent':
          contentType = 2;
          break;
        case 'para':
          contentType = 3;
          break;
        case 'conv':
          contentType = 4;
          break;
        case 'dict':
          contentType = 1;
          break;
        case 'recite':
          contentType = 3;
          break;
      }
      this.request.contentType = contentType
      this.$ajax.post('/vocabs/insertOneVocab', this.request, (res) => {
        if (res.status === 1) {
          this.vocabId = res.data && res.data.vocabId
          this.inVocab = true
          this.$toast({
            text: '收藏成功',
            showWrap: false,
            duration: 1000,
            styleObj: {
              'width': '160px',
              'height': '50px',
              'border-radius': '4px',
              'background-color': '#21bd73'
            }
          })
        }
      })
    },
    deleteOneVocab() {
      this.$ajax.post('/vocabs/deleteOneVocab', {
        vocabId: this.vocabId
      }, (res) => {
        if (res.status === 1) {
          this.inVocab = false
          this.$toast({
            text: '已取消收藏',
            showWrap: false,
            iconFlag: false,
            duration: 1000,
            styleObj: {
              'width': '140px',
              'height': '50px',
              'border-radius': '4px',
              'background-color': 'rgba(0, 0, 0, 0.6)'
            }
          })
        }
      })
    },
    collection() {
      if (this.inVocab) {
        this.deleteOneVocab()
      } else {
        this.insertOneVocab()
      }
    }
  },
  watch: {
    data: function(val) {
      this.handleData()
    }
  },
  mounted() {
    this.handleData()
  }
}
</script>

<style lang='less' scoped>
#collection {
  & > .icon_collection {
    position: absolute;
    top: 0;
    right: 30px;
    display: block;
    width: 30px;
    height: 46px;
    background: url('/static/images/practice/icon_collection.png') no-repeat center;
    background-position: 0 0;
    cursor: pointer;
    &:hover {
      background-position: -30px 0;
    }
    &.show {
      background-position: -60px 0;
    }
  }
} 
</style>