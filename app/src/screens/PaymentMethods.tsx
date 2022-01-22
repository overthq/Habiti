import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Button from '../components/global/Button';
import { useCardsQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import ListEmpty from '../components/global/ListEmpty';
import useGoBack from '../hooks/useGoBack';

const PaymentMethods: React.FC = () => {
	const [{ data, fetching }] = useCardsQuery();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	useGoBack();

	const cards = data?.currentUser.cards;

	if (fetching || !cards) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{cards?.length === 0 ? (
				<ListEmpty
					title='No cards added'
					description='When you add your cards, they will be displayed here.'
					cta={{
						text: 'Add card',
						action: () => navigate('Add Card')
					}}
				/>
			) : (
				<View>
					{cards?.map(card => (
						<View key={card.id} style={styles.card}>
							<Text style={styles.number}>···· {card.last4}</Text>
						</View>
					))}
					<Button
						text='Add card'
						onPress={() => navigate('Add Card')}
						style={{ marginVertical: 8 }}
					/>
				</View>
			)}
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
	},
	card: {
		paddingVertical: 4
	},
	number: {
		fontSize: 16
	}
});

export default PaymentMethods;
