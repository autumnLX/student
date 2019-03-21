<!DOCTYPE html>
<html>
  <head>
    <?php $include = preg_replace('/[\/]+/', '/', $_SERVER['DOCUMENT_ROOT']."/web/scaffold/config.php");include_once ("$include"); ?>
    <meta charset="utf-8">
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <meta name="keywords" content="<?php echo CUSTOMER_PRODUCT_NAME; ?>,英语听说,听说考试,英语口语,口语考试,北京中考,自适应学习,英语自适应">
    <link rel="shortcut icon" href="/static/favicon.ico" type="image/x-icon">
    <title><?php echo WEB_NAME_TITLE; ?></title>
    <link rel="stylesheet" href="/static/styles/common.css">
    <link rel="stylesheet" href="/static/styles/common/km-header.css">
    <link rel="stylesheet" href="/static/styles/common/km-footer.css">
    <script type="text/javascript" src="/static/Config.js"></script>
  </head>
  <body>
    <div id="download" class="minW minH">
      <div class="stu-header bg-white">
        <div class="W">
          <img id="LogoUrl" src="">
        </div>
      </div>
      <div class="about">
        <div class="text1 grey3">关于我们</div>
        <div class="text2"><?php echo CUSTOMER_PRODUCT_NAME; ?>简介</div>
        <div class="text3"><?php echo CUSTOMER_PRODUCT_NAME; ?>是由驰声最新推出的英语听说教辅产品，该平台运用基于深度学习技术的智能语音评测引擎，为学校英语日常教学中听说练习提供解决方案。<?php echo CUSTOMER_PRODUCT_NAME; ?>方便老师布置日常的听说作业，全面记录学生练习过程中的数据，分析班级共性数据和每个学生的个性数据，记录每个学生成长的路径，为老师因材施教提供科学的依据。<?php echo CUSTOMER_PRODUCT_NAME; ?>为每一个学生配备了“智能老师”指导发音练习，方便学生随时做听说练习，并给出科学及时的反馈。</div>
        <div class="text2">用户价值</div>
        <img src="/static/images/about/about1.png">
        <div class="text2">使用场景</div>
        <img src="/static/images/about/about2.png">
        <div class="text2">关于驰声</div>
        <div class="text3">苏州驰声信息科技有限公司是教育行业内一家领先的、专业从事智能语音技术研究和产业化的教育科技公司。驰声基于自主研发的大数据、深度学习的智能语音系列技术，帮助客户实现人机互动的智能学习产品，引领教育信息化创新发展。</div>
        <div class="text2">诚邀合作伙伴</div>
        <div class="text4">
          <div class="text3">你想赶上教育信息化的浪潮吗？</div>
          <div class="text3">你想抓住人工智能的风口吗？</div>
          <div class="text3">你想拥有自己的教育产品吗？</div>
          <div class="text3">代理<?php echo CUSTOMER_PRODUCT_NAME; ?>，抢占3000亿教育信息化市场！</div>
          <div class="text3">驰声帮你打造一个专属的智能教育产品！</div>
        </div>
        <div class="text4" style="margin-top: 36px;">
          <div class="text3">合作伙伴的竞争优势：</div>
          <div class="text3">1、打造自有品牌的产品；</div>
          <div class="text3">2、与驰声建立长期的合作关系；</div>
          <div class="text3">3、利用自己在区域的教育资源，打造专属优质内容，构建内容壁垒；</div>
        </div>
        <div class="text5">期待与您合作共享</div>
        <form>
          <label>您的姓名：</label>
          <input id='name'>
          <label>您的联系方式：</label>
          <input id='phone'>
          <label>您的邮箱：</label>
          <input id='email'>
          <p></p>
          <button type="button" onclick='handleSubmit()'>提交</button>
        </form>
      </div>
      <div class="stu-footer">
        <div>
          <p class="fl text-ct stu-footer-info">
            <span class="fl"><a href="/static/page/youngsters.php" target="_blank" class="fl f12 grey9">青少年安全上网</a><i></i></span>
            <span class="fl"><a href="/static/page/declare.php" target="_blank" class="fl f12 grey9">免责声明</a><i></i></span>
            <span class="fl f12 grey9"><b class="f12 grey9">Copyright 2018</b>&nbsp;苏州驰声信息科技有限公司 All Rights Reserved.<i></i></span>
            <span class="fl f12 grey9">苏ICP备14027754号-4</span>
            <span class="fl f12 grey9" style="padding-left: 0px;">苏公网安备 32059002001971号</span>
            <a href="http://www.jsdsgsxt.gov.cn/mbm/entweb/elec/certView.shtml?siteId=5bda9763ab144330bcc7f1482e5fcc6e" target="_blank">
              <img src="/static/images/ebsIcon.png" width="52" height="45" border="0" style="padding: 0px 10px; border: none;">
            </a>
          </p>
          <div class="stu-footer-browser">
            <a href="http://17ks.chivoxapp.com/guide/360Browse.exe" class="fl f12 grey9"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAcCAMAAADcK/YTAAADAFBMVEVEREQ9z4BLl+FLlOC9SN5HkOC4Rt1ER0VCQ0TiPCT///9No/nTSvhBhN48e96vQNw0x28xxGnx8VDj30fgLhXjzwrjywrfIgrdGwrbDArMSvA6cOBFi98/gN02b92vSMs92IQ6zHw71HgqvmALuVzj4k5ESUzj3EDj2znj2DLrRCvmQSnhOB/iMxzgKQ7hwgrbEgrkDAnx3wX8/f8+e/IzavJMnOzGSejBSOZCoeNEid++Sd6zQtyfNtuqO9q6SdmlOtmcMtiSJdU9mM4worBHeao85Yl3Q4A5yng3yXQ813A+qW9jRW050mwvzmUuw2VSRVZHSlT19VDq6lDj40/U1E/m5kqPkErFxEjI2EZPU0ZBSkZHR0RaRUF3RT2JRjvkRy+2RCzi1yn7RinxQyn6NSHj0xzj0RDWDAzfFAvhxwpWhPq/1PlDjfjFSPUkYPRKm/KTdvFMnvBHh/A9qe8+iu3//OxRWOxJmOq5Tepdcuk5aug1d+e5ROakPuZ1XeXALuRBl+ONMOM2cOKcPOKHK+C0Td9Bid6CVtt5MtvJ7dqtKdnDNNeXL9d0DteLJ9a2SdWfQNSeI9RLj9ONGM9Aac1vDMw5kspKiMV4W8KVHb5KhL1GfLyrKrqdSLRJfK84r6qRR6W0NqU1qZ9EYp2d4Zs7wpTzoJOBQZI8to1HaYo86oY83oY44YNHZYI90YFfUIE9yn9AdX0+xHs+2Xg+vXg+uHFGW3Ahw2i7ImhAjmQ+mGNcRWNBhWBFUl9Anl4julwfmVgNvVQmxlMlwlMztVHm5lBcQU86wk5Sk07NFE772EtDVUvw8Er+/kiFhUhdYkdTVkdHUUboR0JPREJTREFqyz/i3jt3PjvqzjqgoDpoTjqSRjr++TmcRjmoRjZrPTbOSDPU2DKbLjKxJTL15irCwirwKSq7OimQMijlPybj1CXoPCPjHCB1xR7iJRu5uRq4oxrFzhTz3hLXhBLzLRDfAhDmQQzi3QvpxgjrBwfucQXxGAXyggTwbATyIwQBQDhkAAAB/ElEQVQoz2KgAVBb57qPwV3eXn6hDy4lqyZzlwS680iZm/NIzQvApiJwNreZmfOGHgs2FmsWCx77PVjsmcHNxMzkPLOB34YNpEpqAqZJ80FKmCw7uh3swKpYeOTRlWwvYmIGAsv6SY62QFX8tXmVbegOdy1gBYHGKienXkfblrqJK45jWDWnQkZGxsqqvbhzSn9r09ydTx6/fICuZkkuLxDIypaWT+ubdcrQ0PDP/68vrqIoYVebaiLLBwTNJoWLvv2SNJAQ19NNTURRs23/JulqaWk5ObkcrrLLGSA1IjpvtOKQ1Wxc7bVyeo2paX62MRfX8gxJoDEiOq+07iCrAWyzwvotSssWuLgs7uIyPv1P0gBoFae2Vjyymq0KjIyMSl6+fof9l97UN/qbKSECVJOAYpf3GqAaRQ8BQeVD7/T1s4x+Z4rocKY8jEVWs9cNpMZT0P/AkU9iYlmiP7+/59ROvofirzOMCkAlQGNUrqWLioqJ/fjyljMlIRY1DHe5MXqAlJx4lPQ6LV3U6GNiajLMxQgXrVUS8FM5GnldQ1MzKe3zh9vP72NEWPRu3x0HT0aGCQura2hoPn3GcOMKAyaIvnQhQkhVVRWoSv3uLVwJ+nxQkNCxkJCws+ciYnBmjKjw0GAhoeDQcFxKODg4gAmA/WIUOzuIw0B9AAB4A5wlaVOmngAAAABJRU5ErkJggg==" alt="360" class="fl">下载360极速浏览器</a>
            <a href="http://17ks.chivoxapp.com/guide/QQBrowser.exe" class="fl f12 grey9"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAcCAMAAADcK/YTAAACE1BMVEVERET///9DQ0MPoP8PlP8Pqf8PmP81PUP5/v8Ppv8Pov8Pl/8Plf8Pkf8Pj/8Oi/8NgP5HSEk+PT4PuP8NffkKePQFaeQmW4Q/REk9QELz/f/f9P9Mwv8Srv8Pm/8Pmv8Nh/8Phf8Ojf78/PwSmfYEc/YGbukzRlZWVVVLTE00QUw1QUkqN0lGRUU6PkQxOkNAQEH7/v/k/f/u+//n+P/C6/+W2v980f9kyf82u/8Qsv8gsf8Pnf8Piv/l9f4SlPMYq+8Ic+4Gbu0CZd8AYNwAVNcahtXQ0tAXlc8XkMkjZJQyQlFPT1A7R080PUkvOkjQ///C///1/f/w+v/S+f+y8//U8P/P7//K7P+R6v+55/955P+s4/+w4f+u4f+j3/+c3v+L3f9a2P+K1f9zz/84zP9Myf9fyP86wv8cwf8pu/81uP8ls/8Je/+X4/sSrPoHePf19fUUqvUPgPSh6vMTsfPy8vIKd/JfxvEJdO8AY+7S7u3r7uyArOrJ3Onn5+dooOc+iecXjOQAQePh4OAFV9/e3t4TdNqfudnZ2NgpZtVnsdMclNMVgtOp0dINZdDLy83Cx8idxccXdscYfsa3x8Uchre5trUbebEccq9emqwbXqmop6ahoKAhYp2KkpMgVpBvio4la44bRoJ+gIFTdIElYYArYn9Can4mTHwnTXl4d3gsVHdxcXE3WW0rSGxQXGIHlzuXAAABu0lEQVQoz2IgHUiy6+vrs0viUaEt7mYvz8Zt7ybuh0OFhFcRKzcLCy8vH5+cipceVkM8rdh4uHnAavj5mZu0MJVoOciyybPx8AAV8Skp8SuwqWAokvCwkrOR47Zh5eTiYmbht7VVZOn1RVOzSJiZmZmNM3+G+BrxmSrcigqKAizz0BxTysXMLM/qqc4E5DB5T2EREBARUfJGUbNMGGiFrIcvzObJ/CIiogoLUIKuh5WTk1VYHS6gXiwgWi7ajhwA7A6yrJzC05jgAkyzBSodHUX9DZDUZOVYW2cuR9K1KtdJTa1ARwhJTYZltmXqOiQ161XVxMRUUdQAliYjI5O0AmEV08oqZzQ1khXpFhbRs2AqNOZM72h0dXF2QnaPQXeKuXli3gYIb60yIyOjYYOrSz9KxC6NTDYzC52kCWTqatQzgoBdV/Ni1OgqSYiPiQ2Zqim4em4nIwTUtqKlooWBcVGmEcY1ExjhgKPOB1WNbl+Aabi0tBQjhyFClbsuqiLBaqMwaROTYA5GBFDWFEJTNJHRyM5YCkWND1QNQtH8QkapIGQ1LQyYQHCJexmSkjYNrHmDiYEJDoAc6gIAQPBQSVcbAgMAAAAASUVORK5CYII=" alt="QQ" class="fl">下载QQ浏览器</a>
          </div>
        </div>
      </div>
    </div>
    <script type="text/javascript">
      var pic = document.getElementById('LogoUrl')
      pic.src = window.ConfigNew.logoUrl('logo.tea.png')

      var copyright = window.ConfigNew.copyright
      document.querySelector('.stu-footer-info > span > b').innerHTML = copyright

      var submitting = false;

      function createRequestNew(callback) {
        var request = new XMLHttpRequest()
        request.onreadystatechange = () => {
          if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
              let response = JSON.parse(request.responseText)
              typeof callback === 'function' && callback(response)
            } else {
              console.info(request.status)
            }
          }
        }
        return request
      }

      var r20 = /%20/g
      var rbracket = /\[\]$/
      function buildParams(prefix, obj, add) {
        var name;
        if (Array.isArray(obj)) {
          obj.forEach(function (v, i) {
            if (rbracket.test(prefix)) {
              add(prefix, v);
            } else {
              buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, add)
            }
          });
        } else if (typeof obj === 'object') {
          for (name in obj) {
            buildParams(prefix + '[' + name + ']', obj[name], add)
          }
        } else {
          add(prefix, obj)
        }
      }

      function handleParam(param) {
        var prefix
        var result = []
        var add = function (key, value) {
          value = (value == null ? '' : value)
          result[result.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value)
        }
        if (Array.isArray(param)) {
          param.forEach(function (p) {
            add(p.name, p.value)
          })
        } else {
          for (prefix in param) {
            buildParams(prefix, param[prefix], add)
          }
        }
        return result.join('&').replace(r20, '+')
      }

      const $post = (url, data, callback) => {
        let request = createRequestNew(callback)
        request.open('POST', url)
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
        request.send(handleParam(data))
      }

      function handleSubmit() {
        if (!submitting) {
          submitting = true
          var name = document.getElementById('name').value,
            phone = document.getElementById('phone').value,
            email = document.getElementById('email').value;
          var $errTip = document.querySelector('form > p');

          if (name && (phone || email)) {
            if (email && !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)) {
              $errTip.innerHTML = '邮箱格式不正确'
              submitting = false
            } else {
              $post('/api/posts/savePartnerInfo', {
                name,
                phone,
                email,
                from: 'web'
              }, (res) => {
                if (res.status === 1) {
                  $errTip.innerHTML = ''
                  var $inputs = document.querySelectorAll('#name, #phone, #email')
                  for (var i = 0; i < $inputs.length; i++) {
                    $inputs[i].readOnly = true
                  }
                  document.querySelector('form > button').innerHTML = '已提交'
                } else $errTip.innerHTML = res.info
                submitting = false
              })
            }
          } else {
            $errTip.innerHTML = '请将信息填写完整'
            submitting = false
          }
        }
      }
    </script>
    <style>
      /* about */
      .about {
        width: 1180px;
        padding: 50px 125px 35px;
        margin: 20px auto 30px;
        background-color: #fff;
      }
      .grey3 { color: #333; }
      .text1 {
        margin-bottom: 60px;
        font-size: 30px;
        font-weight: bold;
        text-align: center;
        line-height: 40px;
      }
      .text2 {
        position: relative;
        padding-left: 14px;
        margin-top: 40px;
        margin-bottom: 20px;
        color: #333;
        font-size: 18px;
        line-height: 20px;
      }
      .text2::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 20px;
        background-color: #21bd73;
      }
      .text3 {
        color: #666;
        font-size: 16px;
        line-height: 28px;
      }
      .text4 .text3 {
        line-height: 36px;
      }
      .text5 {
        margin: 40px 0 15px;
        color: #666;
        font-size: 16px;
        font-weight: bold;
        line-height: 28px;
        text-align: center;
      }
      form {
        width: 640px;
        margin: 0 auto;
      }
      form label {
        display: block;
        margin-top: 10px;
        color: #666;
        font-size: 16px;
        line-height: 50px;
      }
      form input {
        width: 640px;
        height: 50px;
        border: 1px solid #e3e3e3;
        border-radius: 2px;
        line-height: 48px;
      }
      form input:focus {
        border-color: #21bd73;
      }
      form p {
        margin: 10px 0;
        color: #ff6666;
        line-height: 24px;
        height: 24px;
      }
      form button {
        display: block;
        width: 160px;
        height: 60px;
        margin: 0 auto;
        border: 0;
        border-radius: 30px;
        color: #fff;
        font-size: 18px;
        text-align: center;
        background-color: #1fcd70;
        cursor: pointer;
      }
    </style>
  </body>
</html>