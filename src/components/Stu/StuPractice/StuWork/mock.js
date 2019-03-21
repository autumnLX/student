// export default {
//   'res': 'pron_diagnosis.0.0.2', // 资源版本号
//   'wavetime': 3819, // 音频时长,ms
//   'systime': 683, // 内核运行时间,ms
//   'reftext': 'hello', // 参考文本单词
//   // 报错信息，只有当发生异常报错时才有该字段
//   'error': {
//     'errID': 10109,
//     'errMsg': 'the input is oov.'
//   },
//   'overall': 90, // 纠错检错总分
//   'details': {
//     // 单词发音详情
//     'word': [{
//       'name': 'hello', // 单词名称
//       'lab': 'hh ax l ow', // 该单词标准发音序列
//       'rec': 'hh e l ow', // 识别出的发音序列
//       'start': 580, // 单词发音起始时间，ms
//       'end': 1020, // 单词发音结束时间，ms
//       'dur': 440, // 单词发音时长，ms
//       'is_err': 1, // 0,1 分别表示该单词的音素发音正确和错误
//       'phn': [
//         // 音素详情
//         {
//           'lab': 'hh', // 标准音素
//           'rec': 'hh', // 识别出的音素，如果没有用＃表示
//           'start': 580, // 音素发音起始时间，ms
//           'end': 680, // 音素发音结束时间，ms
//           'dur': 100, // 音素发音时长，ms
//           'is_err': 0 // 音素错误类型，0,1,2,3,4 分别表示该音素的发音结果为正确，插入错误，删除错误，替换错误,清音浊化。
//         },
//         {
//           'lab': 'ax', // 标准音素
//           'rec': 'e', // 识别出的音素，如果没有用＃表示
//           'start': 680, // 音素发音起始时间，ms
//           'end': 780, // 音素发音结束时间，ms
//           'dur': 100, // 音素发音时长，ms
//           'is_err': 3 // 音素错误类型，0,1,2,3分别表示该音素的发音类型为正确，插入错误，删除错误，替换错误。
//         }
//       ]
//     }],
//     // 输入音频信号分析结果
//     'info': {
//       'volume': 205, // 输入音频音量
//       'clip': 0, // 输入音截幅
//       'snr': 9.977636, // 输入音信噪比
//       'trunc': 0, // 输入音截断
//       'tipId': 10004 // 音频分析结果提示
//     }
//   }
// }
export default {
  'score': 7,
  'audioUrl': 'download.cloud.chivox.com:8002/5c6ca4e69a498695532b8212',
  'details': {
    'word': [{
      'name': 'everyone',
      'lab': 'eh v r ih w ah n',
      'is_err': 1,
      'start': 280,
      'end': 1000,
      'phn': [{
        'lab': '#',
        'rec': 'dh',
        'is_err': 1
      }, {
        'lab': 'eh',
        'is_err': 3,
        'rec': 'ey',
        'start': 280,
        'end': 380,
        'dur': 100
      }, {
        'lab': 'v',
        'is_err': 2,
        'rec': '#',
        'start': 380,
        'end': 440,
        'dur': 60
      }, {
        'lab': 'r',
        'is_err': 0,
        'rec': 'r',
        'start': 440,
        'end': 500,
        'dur': 60
      }, {
        'lab': 'ih',
        'is_err': 0,
        'rec': 'ih',
        'start': 500,
        'end': 820,
        'dur': 320
      }, {
        'lab': 'w',
        'is_err': 0,
        'rec': 'w',
        'start': 820,
        'end': 880,
        'dur': 60
      }, {
        'lab': 'ah',
        'is_err': 3,
        'rec': 'ax',
        'start': 880,
        'end': 940,
        'dur': 60
      }, {
        'lab': 'n',
        'is_err': 3,
        'rec': 'l',
        'start': 940,
        'end': 1000,
        'dur': 60
      }],
      'rec': 'dh ey r ih w ax l',
      'dur': 720
    }]
  },
  'fluency': 0,
  'integrity': 0,
  'speed': 0,
  'accuracy': 0,
  'practiceType': 'tx',
  'audio': '',
  'randerSymbol': '<span style="color: #ff5f21">[</span><span style="color: #ff5f21">ð</span><span style="color: #ff5f21">eɪ</span><span style="color: #ff5f21">#</span><span style="color: #6cd173">r</span><span style="color: #6cd173">ɪ</span><span style="color: #6cd173">w</span><span style="color: #ff5f21">ә</span><span style="color: #ff5f21">l</span><span style="color: #ff5f21">]</span>',
  'symbol': "['evriwʌn]"
}
