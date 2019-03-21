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
      <div class="download">
        <div class="block student-block">
          <div class="block-child">
            <img class="qrcode-stu" src="https://download.chivoxapp.com/assets/learning/qr-stu.png">
            <div>
              <a target="_blank" class="android android-stu" href="https://download.chivoxapp.com/assets/learning/stu.apk"></a>
              <a target="_blank" class="ios ios-stu" href="https://itunes.apple.com/cn/app/id1435592349"></a>
            </div>
          </div>
        </div>
        <div class="block teacher-block">
          <div class="block-child">
            <img class="qrcode-tea" src="https://download.chivoxapp.com/assets/learning/qr-tea.png">
            <div>
              <a target="_blank" class="android android-tea" href="https://download.chivoxapp.com/assets/learning/tea.apk"></a>
              <a target="_blank" class="ios ios-tea" href="https://itunes.apple.com/cn/app/id1435593705"></a>
            </div>
          </div>
        </div>
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
    <script src="/static/Config.js"></script>
    <script type="text/javascript">
      var pic = document.getElementById('LogoUrl')
      pic.src = window.ConfigNew.logoUrl('logo.tea.png')

      document.querySelector('.block.student-block').style.backgroundImage = 'url("' + window.ConfigNew.logoUrl('download/stu-bg.png') + '")';
      document.querySelector('.block.teacher-block').style.backgroundImage = 'url("' + window.ConfigNew.logoUrl('download/tea-bg.png') + '")';

      var copyright = window.ConfigNew.copyright
      document.querySelector('.stu-footer-info > span > b').innerHTML = copyright

      fetch('https://download.chivoxapp.com/assets/mobileVsersion.json').then(response => {
        return response.json()
      }).then(data => {
        const {
          customer
        } = ConfigNew
        // console.log(data[ConfigNew.customer])
        const {
          stu,
          tea
        } = data[customer] || {
          stu: {},
          tea: {}
        }
        document.querySelector('.android-stu').href = `https://download.chivoxapp.com/assets/${customer}/stu${stu.version}.apk`
        document.querySelector('.ios-stu').href = stu.iosurl
        document.querySelector('.android-tea').href = `https://download.chivoxapp.com/assets/${customer}/tea${tea.version}.apk`
        document.querySelector('.ios-tea').href = tea.iosurl
        document.querySelector('.qrcode-stu').src = `https://download.chivoxapp.com/assets/${customer}/qr-stu.png`
        document.querySelector('.qrcode-tea').src = `https://download.chivoxapp.com/assets/${customer}/qr-tea.png`
      })
    </script>
    <style>
      /* download */
      .block {
        position: relative;
        height: 710px;
        background-repeat: no-repeat;
        background-position: 50%
      }

      .block.student-block {
        background-color: #24cc7c;
      }

      .block.student-block .android {
        background-image: url(/static/images/download/stu-android.png)
      }

      .block.student-block .android:hover {
        background-image: url(/static/images/download/stu-android-hover.png);
        cursor: pointer
      }

      .block.student-block .ios {
        background-image: url(/static/images/download/stu-ios.png)
      }

      .block.student-block .ios:hover {
        background-image: url(/static/images/download/stu-ios-hover.png);
        cursor: pointer
      }

      .block.teacher-block {
        background-color: #33b8ff;
      }

      .block.teacher-block .android {
        background-image: url(/static/images/download/tea-android.png)
      }

      .block.teacher-block .android:hover {
        background-image: url(/static/images/download/tea-android-hover.png);
        cursor: pointer
      }

      .block.teacher-block .ios {
        background-image: url(/static/images/download/tea-ios.png)
      }

      .block.teacher-block .ios:hover {
        background-image: url(/static/images/download/tea-ios-hover.png);
        cursor: pointer
      }

      .block-child {
        position: absolute;
        top: 456px;
        left: 50%;
        display: -ms-flexbox;
        display: flex
      }

      .block-child img {
        width: 160px;
        height: 160px;
        margin-right: 34px
      }

      .block-child>div {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-direction: column;
        flex-direction: column;
        padding: 15px 0;
        -ms-flex-pack: justify;
        justify-content: space-between
      }

      .block-child>div a {
        display: block;
        width: 248px;
        height: 62px
      }

    </style>
  </body>
</html>
