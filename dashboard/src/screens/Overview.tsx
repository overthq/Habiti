import React from 'react';
import {
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
	Text
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Icon } from '../components/Icon';
import { AppStackParamList } from '../types/navigation';
import { StatPeriod, useStatsQuery } from '../types/api';
import useStore from '../state';

const Overview: React.FC = () => {
	const navigation = useNavigation<NavigationProp<AppStackParamList>>();
	const activeStore = useStore(({ activeStore }) => activeStore);
	const [{ fetching, data }] = useStatsQuery({
		variables: { storeId: activeStore as string, period: StatPeriod.Week }
	});

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity
					style={styles.settings}
					onPress={() => navigation.navigate('Settings')}
				>
					<Icon name='settings' />
				</TouchableOpacity>
			)
		});
	}, [navigation]);

	if (fetching) return <ActivityIndicator />;

	return (
		<ScrollView style={styles.container}>
			<Text>Orders: {data?.stats.orders.length ?? 0}</Text>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 16,
		paddingHorizontal: 16
	},
	settings: {
		marginRight: 16
	}
});

export default Overview;
