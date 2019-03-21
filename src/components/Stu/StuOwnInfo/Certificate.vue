<template lang="pug">
  div.certificateInfo
    div.certificateMain(v-if='certificates.length > 0')
      div.certificateContain
        div(v-for='(item, idx) in certificates' :key='idx')
          div.top(@click='toggle(idx)')
            p.rank {{item.CertificateName}}
            p.name(v-text='userName')
            p.comptitionName {{item.competitionName}}
          div.bottom {{item.sendDate.split(' ')[0]}}日获得
          div.cover-b(:class='{active: currentIndex === idx}' @click='disappear')
            div.imgContain
              p.rank {{item.CertificateName}}
              p.name(v-text='userName')
              p.comptitionName {{item.competitionName}}
      div.line
    div.empty(v-else)
      div.f16.greyc 哎呀~证书空空
    Pagination(:currentPage='currentCPPage' :maxNumPage='maxNumCPPage' :getSkipPage='getSkipPage' v-if='certificates.length > 9')
</template>
<script>
export default {
  name: 'certificate',
  data() {
    return {
      currentCPPage: 1,
      userName: this.$store.state.student.name,
      maxNumCPPage: 2,
      rows: 9,
      certificates: [],
      currentIndex: -1
    }
  },
  methods: {
    getSkipPage(page) {
      this.getList(page)
    },
    toggle(index) {
      this.currentIndex = index
    },
    disappear() {
      this.currentIndex = -1
    },
    getList(page) {
      this.$jsonp('/mEnglishCompetition/getMyCertificate?page=' + (page || 1) + '&rows=' + this.rows, {}, (errs, res) => {
        if (res.status === 1) {
          let pageinfo = res.data.pagination
          this.certificates = res.data.list
          this.currentCPPage = pageinfo.page
          this.maxNumCPPage = Math.ceil(parseInt(pageinfo.totalNum) / parseInt(pageinfo.row)) || 1
        } else {
          this.$store.commit('showErrDialog', {
            errText: res.info,
            btnText: this.$t('dialog.iknow')
          })
        }
      })
    }
  },
  mounted() {
    this.getList()
  }
}
</script>
<style lang="less">
  .certificateInfo {
  	padding-top: 50px;
		display: flex;
		justify-content: center;
		height: 600px;
  	.certificateMain {
  	  .certificateContain {
			  padding: 20px 30px 10px 30px;
			  display: flex;
			  flex-wrap: wrap;
			& > div {
				margin-right: 10px;
				&:last-child {
					margin-right: 0;
				}
				.top {
					width: 270px;
					height: 180px;
					border-radius: 4px;
					background-image: url('/static/images/pic_diploma.png');
					background-size: 270px 180px;
					background-repeat: no-repeat;
					display: flex;
					flex-direction: column;
					align-items: center;
					cursor: pointer;
					position: relative;
					&:last-child {
						margin-right: 0;
					}
					.rank {
						line-height: 18px;
						margin-bottom: 10px;
						font-size: 16px;
						color: #ff9900;
						position: absolute;
						top: 65px;
					}
					.name {
						line-height: 18px;
						font-size: 16px;
						color: #666;
						position: absolute;
						top: 93px;
					}
					.comptitionName {
						line-height: 44px;
						color: #fff;
						font-size: 14px;
						position: absolute;
						bottom: 0;
					}
				}
				.bottom {
					width: 270px;
					line-height: 50px;
	        text-align: center;
	        font-size: 14px;
	        color: #999;
	        margin-bottom: 20px;
				}
				.cover-b {
					display: flex;
					justify-content: center;
					align-items: center;
					background: rgba(0, 0, 0, .1);
					visibility: hidden;
					&.active {
						visibility: visible;
					}
					.imgContain {
						width: 600px;
						height: 400px;
						background-image: url('/static/images/pic_diploma.png');
						background-repeat: no-repeat;
						display: flex;
						flex-direction: column;
						align-items: center;
						cursor: pointer;
						position: relative;
						.rank {
							line-height: 40px;
							font-size: 36px;
							color: #ff9900;
							position: absolute;
							top: 145px;
							margin-bottom: 20px;
						}
						.name {
							line-height: 40px;
							font-size: 36px;
							color: #666;
							position: absolute;
							top: 205px;
						}
						.comptitionName {
							line-height: 96px;
							color: #fff;
							font-size: 24px;
							position: absolute;
							bottom: 0;
						}
					}
				}
			} 
		}
		.line {
			width: 890px;
			border: 1px solid #eeeff6;
			margin: 0 auto;
		}
  }
  .empty {
  	background-image: url('/static/images/pic_empty-01.png');
  	width: 300px;
  	height: 300px;
		margin: 0 auto;
		div {
			padding-top: 230px;
			text-align: center;
			line-height: 30px;
		}
  }
}
</style>