import React from 'react';

interface AuthContextType {
	accessToken?: string;
	userId?: string;
	onLogin: (accessToken: string, userId: string) => void;
}

const AuthContext = React.createContext<AuthContextType>({
	accessToken: undefined,
	userId: undefined,
	onLogin: () => {}
	// isLoggedIn: false,
	// onLogout: () => {},
	// onLogin: (email, password) => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const [accessToken, setAccessToken] = React.useState<string>();
	const [userId, setUserId] = React.useState<string>();

	React.useEffect(() => {
		const accessToken = window.localStorage.getItem('accessToken');
		const userId = window.localStorage.getItem('userId');

		if (accessToken && userId) {
			setAccessToken(accessToken);
			setUserId(userId);
		}
	}, []);

	const handleLogin = (accessToken: string, userId: string) => {
		setAccessToken(accessToken);
		setUserId(userId);
		window.localStorage.setItem('accessToken', accessToken);
		window.localStorage.setItem('userId', userId);
	};

	return (
		<AuthContext.Provider
			value={{
				accessToken,
				userId,
				onLogin: handleLogin
				// isLoggedIn: false,
				// onLogout: () => {},
				// onLogin: (email, password) => {}
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => {
	const context = React.useContext(AuthContext);

	if (!context) {
		throw new Error('useAuthContext must be used within an AuthProvider');
	}

	return context;
};
