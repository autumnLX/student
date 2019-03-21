import KmInput from './km-input.d'
import countdown from './countdown.d'
import adjust from './adjust.d'
import voice_icon from './voice_icon.d'
import messagebox from './messagebox.d'
import button from './button.d'
import KmSelect from './select.d'
import KmSelectOption from './select-option.d'
import KmSelectAllButton from './select-all-button'
import KmForm from './form.d'
import KmFormItem from './form-item.d'
import KmRadio from './radio.d'
import KmRadioGroup from './radio-group.d'
import KmCountdown from './countdown.d'
import KmModal from './km-modal.d'
import KmDialog from './km-dialog.d'


export const KmInput: KmInput
export const countdown: countdown
export const adjust: adjust
export const voice_icon: voice_icon
export const messagebox: messagebox
export const button: button
export const KmSelect:KmSelect
export const KmSelectOption:KmSelectOption
export const KmSelectAllButton:KmSelectAllButton
export const KmRadio:KmRadio
export const KmRadioGroup:KmRadioGroup
export const KmDialog:KmDialog
export function install (vue: typeof Vue, options: InstallationOptions): void
export default {
  install,
  KmInput,
  countdown,
  adjust,
  voice_icon,
  messagebox,
  button,
  KmSelect,
  KmSelectOption,
  KmSelectAllButton,
  KmForm,
  KmFormItem,
  KmRadio,
  KmRadioGroup,
  KmCountdown,
  KmModal,
  KmDialog
}
