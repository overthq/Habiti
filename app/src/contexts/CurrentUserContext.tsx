import React from 'react';
import { useCurrentUserQuery, User } from '../types';

interface CurrentUserContextValue {
	accessToken: string;
	currentUser: User;
}

export const CurrentUserContext = React.createContext<CurrentUserContextValue | null>(
	null
);

export const CurrentUserProvider: React.FC = ({ children }) => {
	const [accessToken, setAccessToken] = React.useState('');
	const [{ data, fetching, error }] = useCurrentUserQuery();

	return (
		<CurrentUserContext.Provider
			value={{ accessToken, currentUser: data?.currentUser }}
		>
			{children}
		</CurrentUserContext.Provider>
	);
};
