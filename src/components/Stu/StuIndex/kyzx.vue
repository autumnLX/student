<template lang="pug">
  div.kyBox.section
    div.title.f16.grey6.text-ct {{$t('Stu.StuIndex.kyzx.title')}}
    div.tip {{$t('Stu.StuIndex.kyzx.showtipMsg')}}
    div.iconEmpty(v-if="showFlag")
    div.pullTemp(v-else)
      div.wrapperBox
      div(v-for="(item, index) in studentList" :key="index" :class="{img0: index === 0, img1: index === 1, img2: index === 2}")
        img(:src="item.headPic ? item.headPic : '/static/images/pic_kyzx_head.png'")
      div.name(v-for="(item, index) in studentList" :key="index + item.stuName" :class="{msg0: index === 0, msg1: index === 1, msg2: index === 2}" ) {{item.stuName}}
</template>

<script>
/**
 * 口语之星
 */
export default {
  data() {
    return {
      showFlag: true,
      studentList: []
    }
  },
  methods: {
    getData() {
      this.$ajax.get('/practices/getThisWeekRank', {}, (res) => {
        if (res.status === 1) {
          if (res.data.length > 0) {
            this.showFlag = false
          }
          this.studentList = [].concat(res.data)
          for (let i = 0; i < 3 - res.data.length; i++) {
            this.studentList.push({})
          }
        } else {
          this.showFlag = true
        }
      })
    }
  },
  mounted() {
    this.getData()
  }
}
</script>
<style lang="less">
@img-url: '../../../assets/image/stu/index';
  .kyBox {
  	padding-top: 10px;
  	text-align: center;
  	width: 260px;
  	height: 250px;
  	position: relative;
  	.iconEmpty {
  	  width: 220px;
  	  height: 140px;
  	  margin: 0 auto;
  	  background: url('@{img-url}/pic_kyzx_empty.png') no-repeat center center;
  	}
  	.pullTemp {
      position: relative;
      display: flex;
      justify-content: center;
      .wrapperBox{
        width: 220px;
        height: 140px;
        margin: 0 auto;
        background: url('@{img-url}/pic_kyzx.png') no-repeat center center;
        z-index: 2;
      }
			div {
				width: 50px;
				height: 50px;
				border-radius: 25px;
				position: absolute;
				background-size: 50px 50px; 
				z-index: 1;
				&.img0 {
          top: 5px;
          left: 103px;
				}
				&.img1 {
					top: 24px;
					left: 37px;
				}
				&.img2 {
          top: 32px;
          left: 172px;
				}
        & img {
          width: 50px;
          height: 50px;
          border-radius: 25px;
        }	
			}
      .name {
        font-size: 12px;
        color: #fff;
        position: absolute;
        z-index: 3;
        width: 70px;
        height: auto;
        white-space: nowrap;
        text-align: center;
        // text-overflow: ellipsis;
        overflow: hidden;
        &.msg0 {
          top: 81px;
          left: 93px;
        }
        &.msg1 {
          top: 101px;
          left: 30px;
        }
        &.msg2 {
          top: 106px;
          left: 160px;
        }
      }
  	}
  	.title {
  	  line-height: 50px;
  	  height: 50px;
  	  cursor: pointer;
      margin-bottom: 10px;
      &:hover + .tip {
        visibility: visible;
      }
  	}
  	.tip {
  	  left: 36px;
  	  top: -42px;
      width: 191px;
      visibility: hidden;
      &:hover {
        visibility: visible;
      }
  	}
  }
</style>