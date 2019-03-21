const F = 'function'
const f = function () {}

export default (() => {
  // const errorType = ['timeout', '']
  let _cfg = { // 默认配置
    record: {},
    timeout: 10 * 1000, // 评分超时时间
    onStop: f, // 自然录音结束的回调
    onScore: f, // 获得评分返回的回调
    onError: f, // 发生任何错误的回调
  }
  let _init = false
  let _media // Chivox aiPanel
  let _player // Chivox player
  let _recorder // Chivox recorder
  let _status = 'idle' // 多媒体机状态 "idle" | "playing" | "recording" | "replaying" | "waiting"
  let _lastRecordId
  let _scoreTimeout
  let _onStopResolved = false

  function getScore() {
    _status = 'waiting';
    !_onStopResolved && _cfg.onStop()

    _scoreTimeout = setTimeout(() => {
      _status = 'idle'
      _cfg.onError('timeout')
    }, _cfg.timeout)

    _recorder.getScores({
      recordId: _lastRecordId,
      success(res) {
        if (_status === 'idle') {
          // 已超时，放弃结果
        } else {
          clearTimeout(_scoreTimeout)

          if (res && res[_lastRecordId]) {
            const data = res[_lastRecordId]
            const errId = data.errId || data.result.errID
            errId ? _cfg.onError(errId) : _cfg.onScore(data)
          } else {
            _cfg.onError('no_data')
          }

          _status = 'idle'
        }
      }
    })
  }

  function play(params) {
    return new Promise((resolve, reject) => {
      _player.load({
        url: params.url,
        success() {
          _player.play({
            onStart: resolve
          })
        },
        error: reject
      })
    })
  }

  function record(params) {
    return new Promise((resolve, reject) => {
      if (_status === 'idle') {
        _recorder.record(Object.assign({}, {
          onRecordIdGenerated: function (code, message) {
            _lastRecordId = message.recordId
          },
          onStart: function () {
            _onStopResolved = false
            _status = 'underway'
            resolve()
          },
          onStop() {
            getScore()
          }
        }, _cfg.record, params))
      } else {
        /* eslint-disable */
        typeof reject === F && reject(new Error('录音机已经启动'))
      }
    })
  }

  function stop() {
    return new Promise((resolve, reject) => {
      if (_status === 'underway' || _status === 'replaying') {
        if (typeof resolve === F) {
          resolve()
          _onStopResolved = true
        }

        if (_status === 'underway') {
          _recorder.stop()
        } else {
          _recorder.stopReplay({
            onStop() {
              console.log('stop replay')
            }
          })
        }
      } else {
        /* eslint-disable */
        typeof reject === F && reject(new Error('录音机并没有启动'))
      }
    })
  }

  function replay() {
    return new Promise((resolve, reject) => {
      if (_lastRecordId) { // 至少录过1次音
        _recorder.startReplay({
          recordId: _lastRecordId,
          onStart() { // 这里不能回调，/胡浩/说技术不能实现
            console.log('replaying')
            _status = 'replaying'
            if (typeof resolve === F) {
              resolve()
            }
          }
        })
      } else {
        typeof reject === F && reject(new Error('还没有进行过录音'))
      }
    })
  }

  const init = (cfg = {}) => {
    _cfg = Object.assign({}, _cfg, cfg)

    if (!_init) {
      _media = new window.chivox.AiPanel(Object.assign({}, window.ConfigNew.sdk, {
        onBeforeRecord() {
          console.log('start record')
        },
        onBeforeReplay() {
          console.log('start replay')
        },
        onRecorderError: (errorType) => {
          console.log(errorType)
        }
      }))
      _player = _media.player
      _recorder = _media.recorder
      _init = true
    }

    return {
      play,
      record,
      replay,
      stop
    }
  }

  return {
    init
  }
})()
