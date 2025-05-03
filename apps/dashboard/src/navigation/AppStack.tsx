import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppStackParamList } from '../types/navigation';

export const AppStack = createNativeStackNavigator<
	AppStackParamList,
	'AppStack'
>();
