import { Platform } from 'react-native';

// Habiti is a marketplace: stores sell physical goods and we take a
// revenue-share commission (no subscriptions or in-app digital purchases),
// so neither Apple IAP nor Google Play Billing applies. Native account and
// store creation are enabled on Android. iOS stays gated to the web flow at
// `${env.webFrontendUrl}/sell` until App Review is confirmed, then flip these
// to `true` unconditionally.
export const STORE_CREATION_ENABLED: boolean = Platform.OS === 'android';
export const ACCOUNT_CREATION_ENABLED: boolean = Platform.OS === 'android';
