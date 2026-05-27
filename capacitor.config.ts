import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.davemoran.dmtracker',
  appName: 'DM Tracker',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#F7F3EE',
      overlaysWebView: false,
    },
    SplashScreen: {
      launchShowDuration: 1000,
      launchAutoHide: true,
      backgroundColor: '#F7F3EE',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
  ios: {
    contentInset: 'always',
    scrollEnabled: false,
    backgroundColor: '#F7F3EE',
    preferredContentMode: 'mobile',
    limitsNavigationsToAppBoundDomains: true,
    allowsLinkPreview: false,
  },
  server: {
    // Remove this block for production builds — it's only for live-reload dev
    // url: 'http://YOUR_LOCAL_IP:5173',
    // cleartext: true,
  },
}

export default config
