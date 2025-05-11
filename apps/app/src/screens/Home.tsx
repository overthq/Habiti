import React from 'react';
import { Screen } from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { LinearTransition } from 'react-native-reanimated';

import HomeMain from '../components/home/HomeMain';
import HomeHeader from '../components/home/HomeHeader';
import HomeSearch from '../components/home/HomeSearch';

const Home: React.FC = () => {
	const [searchOpen, setSearchOpen] = React.useState(false);
	const [searchTerm, setSearchTerm] = React.useState('');
	const { top } = useSafeAreaInsets();

	return (
		<Screen style={{ paddingTop: top }}>
			<HomeHeader
				searchOpen={searchOpen}
				setSearchOpen={setSearchOpen}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
			/>
			<Animated.View style={{ flex: 1 }} layout={LinearTransition}>
				<HomeMain searchOpen={searchOpen} />
				<HomeSearch searchTerm={searchTerm} searchOpen={searchOpen} />
			</Animated.View>
		</Screen>
	);
};

export default Home;
