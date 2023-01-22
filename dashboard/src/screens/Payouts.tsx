import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import useGoBack from '../hooks/useGoBack';
import { useStorePayoutsQuery } from '../types/api';
import { formatNaira } from '../utils/currency';
import { Icon } from '../components/Icon';
import { AppStackParamList } from '../types/navigation';

const Payouts = () => {
	const [{ data, fetching }] = useStorePayoutsQuery();
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();
	useGoBack();

	const handleNewPayout = () => {
		navigate('AddPayout');
	};

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => {
				return (
					<Pressable style={{ marginRight: 16 }} onPress={handleNewPayout}>
						<Icon name='plus' />
					</Pressable>
				);
			}
		});
	}, []);

	if (fetching || !data?.currentStore) {
		return <View />;
	}

	return (
		<View style={styles.container}>
			<Text>Manage previous payouts</Text>
			<View style={styles.bar}>
				<View style={[styles.track, { width: '50%' }]} />
			</View>
			{data.currentStore.payouts.map(payout => (
				<View key={payout.id}>
					<Text>{formatNaira(payout.amount)}</Text>
					<Text>{payout.createdAt}</Text>
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		paddingTop: 8,
		paddingHorizontal: 16
	},
	button: {
		marginVertical: 8
	},
	bar: {
		width: '100%',
		height: 16,
		marginVertical: 8,
		borderRadius: 10,
		backgroundColor: '#D3D3D3',
		overflow: 'hidden'
	},
	track: {
		backgroundColor: '#505050',
		height: '100%'
	}
});

export default Payouts;
