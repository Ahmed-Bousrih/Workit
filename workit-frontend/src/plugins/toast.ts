import Toast, { type PluginOptions, POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import type { App } from 'vue'

const options: PluginOptions = {
  position: POSITION.BOTTOM_RIGHT,
  timeout: 5000,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  showCloseButtonOnHover: true,
  hideProgressBar: false,
  icon: true,
  toastClassName: 'rounded-lg shadow-md',
  bodyClassName: 'text-sm font-medium',
}

export default (app: App) => {
  app.use(Toast, options)
}
