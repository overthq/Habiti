import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/redux/store';

const App = () => {
	return (
		<NavigationContainer>
			<Provider store={store}></Provider>
		</NavigationContainer>
	);
};

export default App;
