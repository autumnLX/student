import jsonp from 'jsonp'

const normalizeUrl = url => {
  let divide = ''
  const hasBegin = /^\//.test(url)
  const hasEnd = /\/$/.test(window.ConfigNew.jdcpIP)
  if (!hasEnd && !hasBegin) {
    divide = '/'
  } else if (hasEnd && hasBegin) {
    url = url.substring(1)
  }
  return window.ConfigNew.jdcpIP + divide + url
}

export function getStudentInfo(callback) {
  return jsonp(normalizeUrl('/WebCompetition/stuInfo'), null, (err, res) => {
    if (err) {

    } else {
      const { result, status, data } = res
      if (result === 1 || status === 1) {
        callback(data)
      } else {

      }
    }
  })
}

export default () => {}
