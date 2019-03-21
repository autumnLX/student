<template lang="pug">
  div
    slot
</template>

<script>
export default {
  name: 'km-form',
  provide () {
    return {
      form: this
    }
  },
  data () {
    return {
      validators: []
    }
  },
  props: {
    models: {
      type: Object,
      default () {
        return {}
      }
    },
    rules: {
      type: Object,
      default () {
        return {}
      }
    },
    separator: {
      type: String | Number,
      default () {
        return ' :'
      }
    },
    labelWidth: {
      default () {
        return '60px'
      }
    },
    align_type: {
      // left right top
      default () {
        return 'right'
      }
    },
    tipDirection: {
      // right bottom
      default () {
        return 'right'
      }
    },
    showError: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    validate () {
      let count = 0;
      let callback
      const promise = new Promise((resolve, reject) => {
        callback = function (flag, errors, invalidFields) {
          flag ? resolve() : reject(errors, invalidFields)
        }
      })
      let flag = true
      this.validators.forEach(validator => {
        validator('', (errors, invalidFields) => {
          count++
          if (errors) {
            flag = false
          }
          if (count >= this.validators.length) {
            callback(flag, errors, invalidFields)
          }
        })
      })
      return promise
    }
  },
  created () {
    this.$on('addValidate', (validate) => {
      console.log(validate)
      this.validators.push(validate)
    })
  }
}
</script>

<style>
</style>
