import { Icon, ListEmpty, Screen, Typography } from '@market/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable } from 'react-native';

import { MastercardIcon } from '../components/cart/CardIcons';
import useGoBack from '../hooks/useGoBack';
import { useCardsQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

const PaymentMethods: React.FC = () => {
	const [{ data, fetching }] = useCardsQuery();
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();
	useGoBack();

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<Pressable style={styles.add} onPress={() => navigate('Add Card')}>
					<Icon name='plus' />
				</Pressable>
			)
		});
	}, []);

	const cards = data?.currentUser.cards;

	if (fetching || !cards) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<Screen style={styles.container}>
			{cards.length === 0 ? (
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
					<Typography
						weight='medium'
						variant='label'
						style={styles.sectionHeader}
					>
						Cards
					</Typography>
					{cards.map(card => (
						<View key={card.id} style={styles.card}>
							<MastercardIcon />
							<Typography>Ending with {card.last4}</Typography>
						</View>
					))}
				</View>
			)}
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16
	},
	sectionHeader: {
		marginTop: 8
	},
	add: {
		marginRight: 16
	},
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 4
	}
});

export default PaymentMethods;
