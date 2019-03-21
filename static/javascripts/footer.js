const { copyright, icp, police, icon } = window.ConfigNew.footer
const pic = document.getElementById('LogoUrl')

pic.src = window.ConfigNew.logoUrl('logo.tea.png')

document.querySelector('.stu-footer-info > span > b.cpr').innerHTML = copyright
document.querySelector('.stu-footer-info > span > a.icp').innerHTML = icp
if (icon) {
  let link = document.querySelector('.stu-footer-info > span.gong-an > a')
  link.innerHTML = '苏公网安备' + police + '号'
  link.href = 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=' + police
} else document.querySelector('.gong-an').remove()
