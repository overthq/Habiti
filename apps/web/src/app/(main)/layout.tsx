'use client';

import React from 'react';

// Ensure that the user is authenticated, or redirect to the login page

interface MainLayoutProps {
	children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	return <div>{children}</div>;
};

export default MainLayout;
