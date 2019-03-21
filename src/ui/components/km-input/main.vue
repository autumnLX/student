<template lang="pug">
    div.form-input(:class="{showBorder:showBorder, disabled: disabled}" @click="$emit('click')")
      div(v-if="$slots.icon")
         slot(name="icon")
      input(
        :placeholder="placeholder",
        :style="{textAlign:textAlign}"
        :value="currentValue"
        ref="input"
        @input="handleInput"
        @focus="handleFocus"
        @blur.self="handleBlur"
        @change="handleChange"
        :autofocus="autofocus"
        :type="type"
        :disabled="disabled"
        :maxlength="maxlength"
        @keyup.enter="$emit('enter')")
      i.icon.icon_delete(v-if="!disabled&&showClear" @click="clear")
</template>
<script>
import emitter from '../../src/mixins/emitter.js'
export default {
  name: 'KmInput',
  data () {
    return {
    }
  },
  props: {
    value: [String, Number],
    showClearIcon: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    autofocus: Boolean,
    rule: Array,
    type: String,
    showBorder: {
      type: Boolean,
      default: true
    },
    maxlength: {
      type: Number
    },
    textAlign: {
      default: 'left'
    }
  },
  mixins: [emitter],
  watch: {
    value (val, oldValue) {
      this.currentValue = val
    }
  },
  computed: {
    showClear () {
      return (
        this.showClearIcon && (this.currentValue || this.currentValue === 0)
      )
    },
    currentValue: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }

  },
  inject: {
    formItem: {
      default: ''
    }
  },
  methods: {
    setCurrentValue (value) {
      this.currentValue = value
    },
    focus () {
      this.$refs.input.focus()
    },
    blur () {
      this.$refs.input.blur()
    },
    clear () {
      this.currentValue = ''
      this.$emit('change', '')
      this.$emit('clear')
      this.focus()
    },
    handleFocus () {
      this.$emit('focus', event)
    },
    handleInput () {
      this.currentValue = event.target.value
    },
    handleBlur () {
      this.$emit('blur', event)
      this.dispatch('km-form-item', 'blur')
    },
    handleChange () {
      this.$emit('change', event.target.value)
      this.dispatch('km-form-item', 'change')
    }
  }
}
</script>
<style lang="less" scoped>
.showBorder {
  border: 1px solid #d3d3d3;
}
.form-input {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 2px;
  background: #fff;
  box-sizing: border-box;
  .icon {
    width: 20px;
    height: 20px;
    background: url('../../image/icon_login.png');
  }
  .icon_delete {
    display: block;
    margin-right: 10px;
    background-position: -42px -1px;
    cursor: pointer;
  }

  &.password {
    margin-top: 20px;
  }

  & > div {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f8f8f8;
    width: 40px;
    height: 38px;

    .icon_username {
      background-position: 0 -1px;
    }

    .icon_password {
      background-position: -20px -1px;
    }
  }

  & > input {
    height: 100%;
    width: 100%;
    flex: 1;
    padding: 0;
    padding-left: 10px;
    padding-right: 10px;
    border: none;
    color: #666;
    font-size: 14px;
    // line-height: 40px;
    outline: none;

    &:-webkit-autofill {
      box-shadow: 0 0 0px 1000px white inset !important;
    }
  }
  input::-webkit-input-placeholder {
    color: #ccc;
  }
  input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #ccc;
  }
  input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #ccc;
  }
  input:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #ccc;
  }
}
</style>
