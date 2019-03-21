export function checkType(value) {
  return Object.prototype.toString.call(value).split(' ')[1].replace(']', '').toLowerCase()
}
