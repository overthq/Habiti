import React from 'react';
import styled from 'styled-components';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import Orders from './pages/Orders';
import Items from './pages/Items';

import Sidebar from './components/Sidebar';
import { Provider, createClient } from 'urql';
import useAccessToken from './hooks/useAccessToken';

const AppContainer = styled.div`
	display: flex;
	align-items: stretch;
	height: 100vh;
`;

const MainContainer = styled.main`
	flex-grow: 1;
`;

const App = () => {
	const { loading, accessToken } = useAccessToken();

	const client = createClient({
		url: 'http://localhost:5000',
		fetchOptions: () => ({
			headers: {
				authorization: accessToken ? `Bearer ${accessToken}` : ''
			}
		})
	});

	return loading ? (
		<div>
			<p>Loading</p>
		</div>
	) : (
		<Provider value={client}>
			<BrowserRouter>
				<AppContainer>
					<Sidebar />
					<MainContainer>
						<Switch>
							<Route exact path='/' component={Home} />
							<Route exact path='/orders' component={Orders} />
							<Route exact path='/items' component={Items} />
						</Switch>
					</MainContainer>
				</AppContainer>
			</BrowserRouter>
		</Provider>
	);
};

export default App;
