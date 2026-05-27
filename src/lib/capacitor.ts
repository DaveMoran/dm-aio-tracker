/**
 * Capacitor native plugin initialisation.
 * This file is the single place where we talk to iOS native APIs.
 * All imports are dynamic so the web build still works without native context.
 */

import { Capacitor } from '@capacitor/core'

export function isNative(): boolean {
  return Capacitor.isNativePlatform()
}

export async function initCapacitor(): Promise<void> {
  if (!isNative()) return

  try {
    const [{ StatusBar, Style }, { SplashScreen }, { App }] = await Promise.all([
      import('@capacitor/status-bar'),
      import('@capacitor/splash-screen'),
      import('@capacitor/app'),
    ])

    // Status bar: dark icons on our light (#F7F3EE) background
    await StatusBar.setStyle({ style: Style.Dark })
    await StatusBar.setBackgroundColor({ color: '#F7F3EE' })

    // Hide the splash screen once the app is ready
    await SplashScreen.hide({ fadeOutDuration: 200 })

    // Handle Android/iOS back button — go to routine tab or exit
    App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        App.exitApp()
      }
    })
  } catch (err) {
    // Non-fatal — native plugins may not be available in all contexts
    console.warn('[Capacitor] Plugin init error:', err)
  }
}

/**
 * Trigger a light haptic tap (use on button presses, completions, etc.)
 */
export async function hapticTap(): Promise<void> {
  if (!isNative()) return
  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics')
    await Haptics.impact({ style: ImpactStyle.Light })
  } catch {
    // silently ignore
  }
}

/**
 * Trigger a medium haptic impact (use on task completion, confirmations)
 */
export async function hapticSuccess(): Promise<void> {
  if (!isNative()) return
  try {
    const { Haptics, NotificationType } = await import('@capacitor/haptics')
    await Haptics.notification({ type: NotificationType.Success })
  } catch {
    // silently ignore
  }
}
