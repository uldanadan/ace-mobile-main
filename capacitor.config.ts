import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'ace.adamar.solutions',
  appName: 'Ace Gaming',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    CordovaPluginWkWebView: {},
    '@capacitor/share': {},
  },
}

export default config
