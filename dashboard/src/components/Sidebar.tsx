import React from 'react';
import styled from 'styled-components';
import { NavLink, useRouteMatch } from 'react-router-dom';

const SidebarContainer = styled.div`
	height: 100%;
	background-color: #100100;
	width: 220px;
	display: flex;
	flex-direction: column;
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

	&:hover {
		background-color: #202020;
	}

	&.active {
		font-weight: bold;
		background-color: #505050;
	}
`;

const Sidebar = () => {
	const match = useRouteMatch();

	return (
		<SidebarContainer>
			<SidebarLink exact to={match.url}>
				Home
			</SidebarLink>
			<SidebarLink exact to={`${match.url}/orders`}>
				Orders
			</SidebarLink>
			<SidebarLink exact to={`${match.url}/items`}>
				Items
			</SidebarLink>
		</SidebarContainer>
	);
};

export default Sidebar;
