import React from 'react';
import { Screen, ScreenHeader } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeStackParamList } from '../types/navigation';
import HomeMain from '../components/home/HomeMain';

const Home: React.FC = () => {
	const { top } = useSafeAreaInsets();
	const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();

	return (
		<Screen style={{ paddingTop: top }}>
			<ScreenHeader
				title='Home'
				search={{
					placeholder: 'Search all stores and products',
					onPress: () => navigate('Home.Search')
				}}
				hasBottomBorder
			/>
			<HomeMain />
		</Screen>
	);
};

export default Home;
