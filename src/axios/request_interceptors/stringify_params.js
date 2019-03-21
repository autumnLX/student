const qs = require('querystring')
export default function stringify(request) {
  request.data = qs.stringify(request.data)
  return request
}
