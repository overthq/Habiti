import { useTheme } from '@habiti/components';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
// import { Dimensions } from 'react-native';
import { Provider } from 'urql';

import HomeTabNavigator from './HomeTab';
import useClient from '../hooks/useClient';
import AddCardWebview from '../screens/AddCardWebview';
import Authenticate from '../screens/Authenticate';
import Cart from '../screens/Cart';
import Landing from '../screens/Landing';
import Onboarding from '../screens/Onboarding';
import Product from '../screens/Product';
// import Register from '../screens/Register';
import Verify from '../screens/Verify';
import useStore from '../state';
import { AppStackParamList } from '../types/navigation';

const AppStack = createNativeStackNavigator<AppStackParamList>();

const Routes: React.FC = () => {
	const { theme } = useTheme();
	const { accessToken } = useStore(state => ({
		accessToken: state.accessToken
	}));
	const client = useClient(accessToken);

	return (
		<Provider value={client}>
			<StatusBar style={theme.statusBar} />
			<NavigationContainer theme={theme.navigation}>
				<AppStack.Navigator screenOptions={{ headerShown: false }}>
					{accessToken ? (
						<>
							<AppStack.Screen name='Home' component={HomeTabNavigator} />
							<AppStack.Group screenOptions={{ headerShown: true }}>
								<AppStack.Screen name='Cart' component={Cart} />
								<AppStack.Group screenOptions={{ presentation: 'modal' }}>
									<AppStack.Screen
										name='Product'
										component={Product}
										options={{
											headerTitle: '',
											gestureDirection: 'vertical'
											// gestureResponseDistance: Dimensions.get('window').height
										}}
									/>
									<AppStack.Screen name='Add Card' component={AddCardWebview} />
								</AppStack.Group>
							</AppStack.Group>
						</>
					) : (
						<>
							<AppStack.Screen name='Landing' component={Landing} />
							<AppStack.Screen name='Register' component={Onboarding} />
							<AppStack.Screen name='Authenticate' component={Authenticate} />
							<AppStack.Screen name='Verify' component={Verify} />
						</>
					)}
				</AppStack.Navigator>
			</NavigationContainer>
		</Provider>
	);
};

export default Routes;
