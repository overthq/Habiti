import React from 'react';
import styled from 'styled-components';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Home from './pages/Home';
import Orders from './pages/Orders';
import Items from './pages/Items';
import Onboarding from './pages/Onboarding';
import Authenticate from './pages/Authenticate';
import VerifyAuthentication from './pages/VerifyAuthentication';

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
					<Route path='/onboarding' component={Onboarding} />
					<Route path='/store/:storeId/authenticate' component={Authenticate} />
					<Route
						path='/store/:storeId/verify-code'
						component={VerifyAuthentication}
					/>
					<Route
						path='/store/:storeId'
						component={() =>
							accessToken ? (
								<Redirect to='/store/:storeId/dashboard' />
							) : (
								<Redirect to='/store/:storeId/authenticate' />
							)
						}
					/>
					<Route
						path='/store/:storeId/dashboard'
						render={({ match }) => (
							<>
								<Sidebar />
								<MainContainer>
									<Switch>
										<Route path={match.url} component={Home} />
										<Route path={`${match.url}/orders`} component={Orders} />
										<Route path={`${match.url}/items`} component={Items} />
									</Switch>
								</MainContainer>
							</>
						)}
					/>
					<Route
						exact
						strict
						path='/'
						component={() => <Redirect to='/onboarding' />}
					/>
				</AppContainer>
			</BrowserRouter>
		</Provider>
	);
};

export default App;
