import { createNavigationContainerRef } from '@react-navigation/native';

import type { AppStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<AppStackParamList>();
