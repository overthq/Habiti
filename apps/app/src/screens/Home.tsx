import React from 'react';
import { Screen, useTheme } from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeMain from '../components/home/HomeMain';
import HomeHeader from '../components/home/HomeHeader';
import HomeSearch from '../components/home/HomeSearch';
import Animated, { LinearTransition } from 'react-native-reanimated';

const Home: React.FC = () => {
	const [searchOpen, setSearchOpen] = React.useState(false);
	const [searchTerm, setSearchTerm] = React.useState('');
	const { theme } = useTheme();
	const { top } = useSafeAreaInsets();

	return (
		<Animated.View
			style={{
				flex: 1,
				backgroundColor: theme.screen.background,
				paddingTop: top
			}}
			layout={LinearTransition}
		>
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
		</Animated.View>
	);
};

export default Home;
