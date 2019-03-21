const key2key = {
  id: 'id',
  head_pic: 'avatar',
  student_name: 'name',
  gender: 'gender',
  phone: 'phone',
  email: 'email',
  province_name: 'province',
  city_name: 'city',
  country_id: 'districtId',
  country_name: 'district',
  school_name: 'school',
  category_name: 'grade',
  school_class_id: 'classId',
  class_name: 'clazz',
  phone_certified: 'certified',
  vip_expired: 'vip'
}

export default {
  namespaced: true,
  state: {
    id: '',
    avatar: '',
    name: '',
    gender: '',
    phone: '',
    email: '',
    province: '',
    city: '',
    districtId: '',
    district: '',
    school: '',
    grade: '',
    clazz: '',
    vip: false,
    expired: ''
  },
  mutations: {
    init(state, payload) {
      for (let key in payload) {
        let _value = payload[key]
        let _key = key2key[key]

        if (_key === 'vip') {
          if (_value) {
            state['expired'] = _value
            state['vip'] = new Date(_value) > new Date()
          } else {
            // 从来没有开通过vip，自然也不是vip
          }
        } else {
          if (_key === 'gender') {
            _value = Number(_value)
          } else if (_key === 'avatar' && !/^http/.test(_value)) {
            _value = window.ConfigNew.resUrl + _value
          }

          state[_key] = _value
        }
      }
    },
    set(state, payload) {
      const { key, value } = payload
      state[key] = value
    }
  }
}
