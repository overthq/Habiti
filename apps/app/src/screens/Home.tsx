import { Icon, Screen } from '@market/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable } from 'react-native';

import { useHomeQuery } from '../types/api';
import { HomeStackParamList } from '../types/navigation';

// TODO: To encourage purchases, whe should probably list the sections in this order:
// - "items you will love"
// - "watchlist/wishlist"
// - "discounts for you"
// - "followed stores"
// - "recent orders" (we might have an option to make this the most prominent, since
//   a number of users will want to look at their pending deliveries first).

// The idea with this is, we want going to the explore page to be the last resort.
// You should be able to get started buying things from the home page.

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
