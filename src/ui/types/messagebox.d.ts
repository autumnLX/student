import Vue from 'vue'
declare module 'vue/types/vue' {
  interface Vue {
    $msgbox: ElMessageBox

    $alert: ElMessageBoxShortcutMethod

    $confirm: ElMessageBoxShortcutMethod

    // $prompt: ElMessageBoxShortcutMethod
  }
}