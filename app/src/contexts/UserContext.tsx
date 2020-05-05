import React from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { User } from '../types';

interface UserContextValue {
	user: User | null;
	saveUser(user: User | null): void;
	logOut(): void;
}

export const UserContext = React.createContext<UserContextValue>({
	user: null,
	saveUser: () => {
		// noop
	},
	logOut: () => {
		// noop
	}
});

export const UserProvider: React.FC = ({ children }) => {
	const [loading, setLoading] = React.useState(true);
	const [user, setUser] = React.useState<User | null>(null);

	React.useEffect(() => {
		fetchUser();
	}, []);

	const saveUser = async (user: User) => {
		await AsyncStorage.setItem('user', JSON.stringify(user));
		setUser(user);
	};

	const fetchUser = async () => {
		try {
			const savedUser = await AsyncStorage.getItem('user');
			if (!savedUser) return setUser(null);
			const fetchedUser: User = JSON.parse(savedUser);
			setUser(fetchedUser);
		} finally {
			setLoading(false);
		}
	};

	const logOut = async () => {
		await AsyncStorage.removeItem('user');
		setUser(null);
	};

	return (
		<UserContext.Provider value={{ user, saveUser, logOut }}>
			{loading ? <View /> : children}
		</UserContext.Provider>
	);
};
