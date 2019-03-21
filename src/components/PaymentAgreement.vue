<template lang="pug">
  div#payment-agreement
    Header
    div.disclaimer
      div.text1 {{ pname }}用户付费协议
      div.text2 欢迎使用{{ pname }}，为保障用户权益，请用户在付费之前，详细阅读此服务协议（以下简称“本协议”）所有内容。当用户点选“【我已经阅读并同意《{{ pname }}用户付费协议》】”的，即表示用户同意并承诺遵守本协议。{{ pname }}已经发布的或将来可能发布的各类规则。所有规则为本协议不可分割的组成部分，与协议正文具有同等法律效力。
      div.text2 第一条 定义
      div.text2 1、{{ pname }}指驰声科技所有和经营的有关教育、学习等数字内容聚合、管理和分发的平台产品，旨在为机构及用户提供教学内容的生成、传播和学习等平台服务。
      div.text2 2、收费服务是指机构发布至{{ pname }}，有偿提供给用户的测评、报告、文字、视频等内容。
      div.text2 第二条 本协议的修订
      div.text2 {{ pname }}有权对本协议进行调整或补充，若用户继续使用{{ pname }}的，则视为接受该等调整或补充，亦或用户有权终止使用该服务。
      div.text2 第三条 {{ pname }}规范
      div.text2 1、 {{ pname }}作为平台提供方，为机构及用户提供平台服务。机构通过{{ pname }}平台可以为用户提供有偿服务或内容（包括但不限于收费测评、收费报告、收费视频等所有收费类型的服务和内容，下同），{{ pname }}并非该等有偿服务或内容的提供方或售卖方。
      div.text2 2、{{ pname }}不参与用户与机构的交易。对于任何直接或间接的、实质或非实质的由于有偿服务或内容造成的损失或纠纷，{{ pname }}不承担责任，但将根据{{ pname }}的相关规则为用户提供必要的客户服务。
      div.text2 3、除非另有证明，{{ pname }}储存在其服务器上的数据是用户使用{{ pname }}的唯一有效证据。
      div.text2 第四条 用户规则
      div.text2 1、用户可在{{ pname }}平台上浏览机构发布的内容信息，用户在使用{{ pname }}时登录的帐号是{{ pname }}确认用户身份的唯一依据。
      div.text2 2、用户理解并同意：机构通过{{ pname }}平台提供有偿内容或服务实行先付款后使用的方式，用户及时、足额、合法的支付所需的款项是您使用该等有偿内容或服务的前提。
      div.text2 3、用户理解并同意，用户通过{{ pname }}平台购买收费服务后，在符合相关法律、法规规定的情况下，{{ pname }}有权根据上述规定对您购买的收费服务不予退款。
      div.text2 4、用户知悉并同意，用户无权对已购买的服务进行出售、转让、许可或其他方式使除用户自己以外的第三方（包括但不限于自然人、法人或其他组织）使用其已购买的服务。若用户违反本条规定，则{{ pname }}有权视情况采取如下措施：
      div.text2 4.1  取消用户继续使用该服务的权利；
      div.text2 4.2 限制/冻结用户的帐号；
      div.text2 4.3 要求用户退还其通过出售、转让、许可等其他方式取得的收益；
      div.text2 4.4  其他{{ pname }}可以采取的救济措施。
      div.text2 5、用户了解并同意，机构可能会基于自身原因（包括但不限于：更新服务内容、改进服务安排）不定期的对收费服务进行更新而无需经过您的事先同意。。
      div.text2 6、用户支付款支持第三方交易平台，用户需要自行承担交易所产生的法律后果。
      div.text2 7、用户应保管好自己的帐号和密码，如因用户未保管好自己的帐号和密码而对自己、{{ pname }}或第三方造成损害的，用户将负全部责任。另外，用户应对用户帐号中的所有活动和事件负全责。用户可随时改变帐号和密码。用户同意若发现有非法使用用户的帐号或出现安全漏洞的情况，立即通告{{ pname }}，{{ pname }}将会尽力予以妥善解决。
      div.text2 第五条  其他约定
      div.text2 1、所有权及知识产权：{{ pname }}平台上所有内容，包括但不限于文字、软件、声音、图片、视频、图表、网站架构、网站画面的安排、网页设计、以及有偿内容或服务均由{{ pname }}、机构或其他权利人依法拥有其知识产权，包括但不限于著作权、商标权、专利权等。非经{{ pname }}、机构或其他权利人书面同意用户不得擅自使用、修改、复制、传播、改变、散布、发行或发表上述内容。如有违反，用户同意承担由此给{{ pname }}、驰声科技、机构或其他权利人造成的一切损失。
      div.text2 2、通知：所有发给用户的通知都可通过电子邮件、常规的信件或在网站显著位置公告的方式进行传送。
      div.text2 3、本协议适用中华人民共和国的法律（不含冲突法）。当本协议的任何内容与中华人民共和国法律相抵触时，应当以法律规定为准，同时相关内容将按法律规定进行修改或重新解释，而本协议其他部分的法律效力不变。
      div.text2 4、本协议自发布之日起实施，并构成用户和{{ pname }}之间的共识。
      div.text2 5、{{ pname }}不行使、未能及时行使或者未充分行使本协议或者按照法律规定所享有的权利，不应被视为放弃该权利，也不影响{{ pname }}在将来行使该权利。
      div.text2 6、如果用户对本协议内容有任何疑问，请联系客服。
    Footer
</template>


<script>
/**
 * 付费协议
 */
import Header from './Stu/header'
import Footer from './Stu/footer'

export default {
  name: 'PaymentAgreement',
  components: { Header, Footer },
  data () {
    return {
      pname: window.ConfigNew.header.name,
    }
  },
}
</script>

<style lang="less">
#payment-agreement {
  .stu-header {
    .linkArea {
      display: none !important;
    }
  }

  .disclaimer {
    width: 1180px;
    padding: 50px 125px 90px;
    margin: 20px auto 30px;
    background-color: #fff;

    .text1 {
      margin-bottom: 60px;
      color: #333;
      font-size: 30px;
      font-weight: bold;
      text-align: center;
      line-height: 40px;
    }

    .text2 {
      margin-bottom: 35px;
      color: #666;
      font-size: 16px;
      line-height: 36px;
    }
  }
}
</style>
