import React from 'react';
import styled from 'styled-components';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import Orders from './pages/Orders';
import Items from './pages/Items';

import Sidebar from './components/Sidebar';
import { Provider, createClient } from 'urql';

const AppContainer = styled.div`
	display: flex;
	align-items: stretch;
	height: 100vh;
`;

const MainContainer = styled.main`
	flex-grow: 1;
`;

const client = createClient({
	url: 'http://localhost:5000'
});

const App = () => {
	return (
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
