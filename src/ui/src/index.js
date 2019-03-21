import _KmInput from '../components/km-input'
import _Countdown from '../components/countdown'
import _adjust from '../components/adjust'
import _voice_icon from '../components/voice_icon'
import _messagebox from '../components/messagebox'
import _button from '../components/button'
import _km_select from '../components/km-select'
import _km_select_option from '../components/km-select-option'
import _km_Select_all_button from '../components/km-select-all'
import _km_form from '../components/form'
import _km_form_item from '../components/form-item'
import _km_radio from '../components/radio'
import _km_radio_group from '../components/radio-group'
import _km_tabs from '../components/tabs'
import _km_tab_pane from '../components/tab-pane'
import _km_carousel from '../components/carousel'
import _km_carousel_item from '../components/carousel-item'
import _km_Modal from '../components/km-modal'
import _km_dialog from '../components/km-dialog'

const components = [_KmInput,
  _Countdown, _adjust, _voice_icon, _button, _km_select, _km_select_option, _km_Select_all_button, _km_form,
  _km_form_item,
  _km_radio,
  _km_radio_group,
  _km_tabs,
  _km_tab_pane,
  _km_carousel,
  _km_carousel_item,
  _km_Modal,
  _km_dialog
]

function install(vue) {
  components.forEach(component => {
    vue.component(component.name, component)
  })
  vue.use(_messagebox)
}
export const KmInput = _KmInput
export const countdown = _Countdown
export const adjust = _adjust
export const voice_icon = _voice_icon
export const messagebox = _messagebox
export const button = _button
export const KmButton = _button
export const kmSelect = _km_select
export const KmSelectOption = _km_select_option
export const KmSelectAllButton = _km_Select_all_button
export const KmForm = _km_form
export const KmFormItem = _km_form_item
export const KmRadio = _km_radio
export const KmRadioGroup = _km_radio_group
export const KmTabs = _km_tabs
export const kmTabPane = _km_tab_pane
export const KmCarousel = _km_carousel
export const KmCarouselItem = _km_carousel_item
export const KmModal = _km_Modal
export const KmDialog = _km_dialog

export default {
  install,
  KmInput,
  countdown,
  adjust,
  voice_icon,
  messagebox,
  button,
  KmButton,
  kmSelect,
  KmSelectOption,
  KmSelectAllButton,
  KmForm,
  KmFormItem,
  KmRadio,
  KmRadioGroup,
  KmTabs,
  kmTabPane,
  KmCarousel,
  KmCarouselItem,
  KmModal,
  KmDialog
}
