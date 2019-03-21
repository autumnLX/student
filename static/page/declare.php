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
    <div id="disclaimer" class="minW minH">
      <div class="stu-header bg-white">
        <div class="W">
          <img id="LogoUrl" src="">
        </div>
      </div>
      <div class="disclaimer">
        <div class="text1">免责声明</div>
        <div class="text2">您在接受苏州驰声信息科技有限公司（以下简称驰声）旗下的<?php echo CUSTOMER_PRODUCT_NAME; ?>——英语听说自适应学习平台 （以下简称<?php echo CUSTOMER_PRODUCT_NAME; ?>)服务之前，请务必仔细阅读本条款并同意本声明。如果您对本声明的任何条款表示异议，可以选择停止使用当前产品或服务，您使用该产品或服务的行为将被视为对本声明全部内容的接受及认可。</div>
        <div class="text2">驰声旗下的<?php echo CUSTOMER_PRODUCT_NAME; ?>为特定机构定制封闭的用于辅助教学的网站，并为这些机构的学员提供服务。驰声旗下的<?php echo CUSTOMER_PRODUCT_NAME; ?>主要通过基于人工智能技术的口语评测为学生提供英语听说训练的教学服务，并通过机构向接受该服务的学生收取学费。简单说：网站属于机构，评测服务来自驰声旗下的<?php echo CUSTOMER_PRODUCT_NAME; ?>。</div>
        <div class="text2">驰声旗下的<?php echo CUSTOMER_PRODUCT_NAME; ?>在产品和服务中不拥有对教学内容的任何权利。驰声旗下的<?php echo CUSTOMER_PRODUCT_NAME; ?>提供的产品中的教学内容均由合法购买了包含该教学内容教材（包括但不限于与教材配套的书、软件、音频等内容及其合法使用权）的用户（包括但不限于培训机构、学校、学生或其他使用驰声旗下的<?php echo CUSTOMER_PRODUCT_NAME; ?>的互联网用户）为其个人使用之目的上传，驰声旗下的<?php echo CUSTOMER_PRODUCT_NAME; ?>仅为用户使用其上传的教学内容提供技术支持。简单说：内容来源和使用权属于机构。</div>
        <div class="text2">驰声旗下的<?php echo CUSTOMER_PRODUCT_NAME; ?>并不传播任何用户上传的教学内容，亦不从这些教学内容中获得任何收益。如果任何单位或个人认为用户上传驰声旗下的<?php echo CUSTOMER_PRODUCT_NAME; ?>的教学内容可能涉嫌侵犯其合法权益，应该及时向驰声旗下的<?php echo CUSTOMER_PRODUCT_NAME; ?>提供书面反馈，并提供身份证明、权属证明及详细侵权情况证明，并收到上述法律文件后，会向上传相关教学内容的客户转送通知书，确认该用户无权接触使用该等内容后，驰声旗下的<?php echo CUSTOMER_PRODUCT_NAME; ?>将会尽快停止对这些用户的服务。用户在使用驰声旗下的<?php echo CUSTOMER_PRODUCT_NAME; ?>前，应确保其已通过购买包含相关教学内容的教材等方式拥有了对相关教学内容的使用权，用户确保其上传相关教学内容的行为不侵犯任何第三方权利。</div>
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
    </script>
    <style>
      .disclaimer {
        width: 1180px;
        padding: 50px 125px 90px;
        margin: 20px auto 30px;
        background-color: #fff;
      }
      .disclaimer .text1 {
        margin-bottom: 60px;
        color: #333;
        font-size: 30px;
        font-weight: bold;
        text-align: center;
        line-height: 40px;
      }
      .disclaimer .text2 {
        margin-bottom: 35px;
        color: #666;
        font-size: 16px;
        line-height: 36px;
      }
    </style>
  </body>
</html>