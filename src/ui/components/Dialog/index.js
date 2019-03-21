import common from './Common/App' // 通用
import payment from './Payment/App' // 支付
import paymentTip from './Payment/Tip' // 支付 温馨提示
import paymentFail from './Payment/Fail' // 支付 失败
import getScore from './GetScore/App' // 获取我的成绩
import upGrade from './UpGrade/App' // 升年级
import phoneDialog from './PhoneNumberAuthentication/App' // 手机验证
import promote from './Promote/App' // 晋级 升年级
import sso from './Sso/App' // 单点登录
import newTask from './NewTask/App' // 新作业新测评
import WarningPopup from './WarningPopup/App' // 测评时弹窗
import WarningPopupRErr from './WarningPopup/RErr' // 测评时弹窗 连续两次录音报错

export default {
  common,
  payment,
  paymentTip,
  paymentFail,
  getScore,
  upGrade,
  phoneDialog,
  promote,
  sso,
  newTask,
  WarningPopup,
  WarningPopupRErr,
}
