import { Platform } from 'react-native';

export const STORE_CREATION_ENABLED: boolean = Platform.OS === 'android';
export const ACCOUNT_CREATION_ENABLED: boolean = Platform.OS === 'android';
