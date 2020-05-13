import React from 'react';
import styled from 'styled-components';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { Icon } from './icons';

const SidebarContainer = styled.div`
	height: 100%;
	background-color: #000000;
	width: 220px;
	display: flex;
	flex-direction: column;
	padding: 20px;
`;

const SidebarLink = styled(NavLink)`
	font-size: 14px;
	font-weight: 500;
	color: #d3d3d3;
	width: 100%;
	height: 35px;
	text-decoration: none;
	display: flex;
	align-items: center;
	padding-left: 15px;
	border-radius: 6px;
	align-self: center;
	margin-bottom: 5px;
	font-size: 15px;

	&:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	&.active {
		background-color: rgba(255, 255, 255, 0.2);
		font-weight: bold;
	}

	p {
		margin-left: 8px;
	}
`;

const Sidebar = () => {
	const match = useRouteMatch();

	return (
		<SidebarContainer>
			<SidebarLink exact to={match.url}>
				<Icon name='home' />
				<p>Home</p>
			</SidebarLink>
			<SidebarLink exact to={`${match.url}/orders`}>
				<Icon name='inbox' />
				<p>Orders</p>
			</SidebarLink>
			<SidebarLink exact to={`${match.url}/items`}>
				<Icon name='tag' />
				<p>Items</p>
			</SidebarLink>
		</SidebarContainer>
	);
};

export default Sidebar;
