export function getPropByPath(obj, prop) {
  let keyArr = prop.split('.')
  let i = 0;
  let len = keyArr.length
  let temObj = obj;
  let key;
  for (; i < len; i++) {
    key = keyArr[i]
    if (key in temObj) {
      temObj = temObj[key]
    } else {
      console.error('无效的prop ' + key);
      temObj = null
    }
  }
  return temObj
}

export const valueEquals = (a, b) => {
  // see: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
  if (a === b) return true;
  if (!(a instanceof Array)) return false;
  if (!(b instanceof Array)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i !== a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};
