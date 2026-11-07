import { createNavigationContainerRef } from '@react-navigation/native';

import type { AppStackParamList } from '../navigation/types';

export const navigationRef = createNavigationContainerRef<AppStackParamList>();
