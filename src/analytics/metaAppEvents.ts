import { InteractionManager, Platform } from 'react-native';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { Settings } from 'react-native-fbsdk-next';

export function initializeMetaAppEvents(): void {
  InteractionManager.runAfterInteractions(() => {
    void (async () => {
      try {
        if (Platform.OS === 'ios') {
          const { status } = await requestTrackingPermissionsAsync();
          Settings.initializeSDK();
          await Settings.setAdvertiserTrackingEnabled(status === 'granted');
        } else {
          Settings.initializeSDK();
        }
      } catch {
        // Missing native build (e.g. Expo Go) or SDK init failure — do not affect app UX
      }
    })();
  });
}
