import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useCardsQuery } from '../types/api';

const PaymentMethods: React.FC = () => {
	const [{ data, fetching }] = useCardsQuery();

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
		flex: 1
	},
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default PaymentMethods;
