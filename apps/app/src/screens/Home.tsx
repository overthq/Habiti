import { Icon, Screen } from '@market/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable } from 'react-native';

import { useHomeQuery } from '../types/api';
import { HomeStackParamList } from '../types/navigation';

const Home: React.FC = () => {
	const [{ fetching, data }] = useHomeQuery();
	const { navigate, setOptions } =
		useNavigation<NavigationProp<HomeStackParamList>>();

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => {
				return (
					<Pressable
						onPress={() => navigate('Notifications')}
						style={{ marginRight: 16 }}
					>
						<Icon name='bell' size={22} />
					</Pressable>
				);
			}
		});
	}, []);

	return <Screen />;
};

export default Home;
