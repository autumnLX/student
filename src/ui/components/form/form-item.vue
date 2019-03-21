<template lang="pug">
  div.form-item(:class="{top:isTop}")
    label.label(v-if="label || $slots.label" :style="labelStyle" :class="{required:isRequired}")
      slot(name="label") {{ label_current }}
    div.content(:style="{marginLeft:labelStyle.width}" :class="{content_error:show_error}")
      slot
      span.errortip(v-show="show_error" :class="{[form.tipDirection]:true}") {{ errortip }}
</template>

<script>
import AsyncValidator from 'async-validator';
import { getPropByPath } from '../../src/utils/util.js'
import emitter from '../../src/mixins/emitter.js'
export default {
  name: 'km-form-item',
  props: {
    label: '',
    prop: '',
    rules: {
      type: Array
    },
    labelWidth: '',
    showError: {
      type: Boolean,
      default: true
    },
    required: {
      type: Boolean,
      default: undefined
    }
  },
  data () {
    return { errortip: '' }
  },
  inject: ['form'],
  mixins: [emitter],
  provide () {
    return {
      'formItem': this
    }
  },
  computed: {
    show_error () {
      return this.form.showError && this.showError && this.errortip
    },
    label_current () {
      return this.label + this.form.separator
    },
    labelStyle () {
      const labelStyle = {}
      labelStyle.width = this.labelWidth || this.form.labelWidth
      if (this.form.align_type !== 'top') {
        labelStyle.textAlign = this.form.align_type
      } else {
        labelStyle.textAlign = 'right'
      }
      return labelStyle
    },
    isTop () {
      return this.form.align_type === 'top'
    },
    isRequired () {
      return !!JSON.stringify(this.rule).match('required')
    },
    rule () {
      const requriedRule = this.required !== undefined ? { required: this.required, message: '必填项' } : []
      return (this.rules || (this.form.rules && this.prop && getPropByPath(this.form.rules, this.prop)) || []).concat(requriedRule)
    }
  },
  methods: {
    validate (trigger = '', call = () => { }) {
      let rules = this.getRules(trigger)
      if (!rules) {
        call()
        return
      }
      // const des = rules.forEach(rule => {
      //   delete rule.trigger
      // })

      const model = {}
      model[this.prop] = this.form.models[this.prop]
      const validate = new AsyncValidator({
        [this.prop]: rules
      })
      validate.validate(model, { firstFields: true }, (errors, invalidFields) => {
        this.errortip = errors ? errors[0].message : ''
        call(errors, invalidFields)
      })
    },
    getRules (trigger) {
      if (this.rule.length === 0) return
      let rules = this.rule.filter(rule => {
        if (trigger === '') {
          return true
        }
        // 如果是一个数组， 则去寻找数组中是否含有触发类型
        if (Array.isArray(rule.trigger)) {
          return rule.trigger.indexOf(trigger) > -1
        } else {
          return rule.trigger === trigger
        }
      }).map(rule => {
        return Object.assign({}, rule)
      })
      return rules
    }
  },
  mounted () {
    this.$on('blur', () => {
      this.validate('blur')
    })
    this.$on('change', () => {
      console.log(123)
      this.validate('change')
    })
    this.prop && this.dispatch('km-form', 'addValidate', this.validate)
  }
}
</script>

<style lang="less" scoped>
label.required::before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 22px;
}
.label {
  padding-right: 10px;
  position: absolute;
  box-sizing: border-box;
}
.form-item.top {
  display: block;
}
.top .label {
  display: block;
  margin-bottom: 10px;
  margin-right: 0;
}
.content {
  display: flex;
  align-items: center;
  position: relative;
}
.errortip {
  color: #ff6666;
  position: absolute;
  left: 100%;
  margin-left: 10px;
  white-space: nowrap;
}
.errortip.bottom {
  margin-left: 0;
  left: 0;
  top: 100%;
}
</style>
