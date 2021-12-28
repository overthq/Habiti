import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Button from '../components/global/Button';
import { useCardsQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

const PaymentMethods: React.FC = () => {
	const [{ data, fetching }] = useCardsQuery();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	if (fetching) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator />
			</View>
		);
	}

	const cards = data?.currentUser.cards;

	return (
		<View style={styles.container}>
			<Button
				text='Add card'
				onPress={() => navigate('Add Card')}
				style={{ marginVertical: 8 }}
			/>
			{cards?.map(card => (
				<View key={card.id}>
					<Text>Ending in {card.last4}</Text>
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16
	},
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default PaymentMethods;
