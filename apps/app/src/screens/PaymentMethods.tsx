import {
	Icon,
	ListEmpty,
	Screen,
	Typography,
	useTheme
} from '@market/components';
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
	const { theme } = useTheme();
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
		<Screen>
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
					<View
						style={[
							styles.separator,
							{ borderBottomColor: theme.border.color }
						]}
					/>
					{cards.map(card => (
						<Pressable
							key={card.id}
							style={[styles.card, { borderBottomColor: theme.border.color }]}
						>
							<MastercardIcon />
							<Typography
								style={styles.capitalize}
							>{`${card.cardType} \u2022\u2022\u2022\u2022${card.last4}`}</Typography>
						</Pressable>
					))}
				</View>
			)}
		</Screen>
	);
};

const styles = StyleSheet.create({
	sectionHeader: {
		marginTop: 16,
		marginBottom: 8,
		marginLeft: 16
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
		paddingVertical: 4,
		paddingHorizontal: 16,
		borderBottomWidth: 0.5
	},
	capitalize: {
		textTransform: 'capitalize'
	},
	separator: {
		borderBottomWidth: 0.5
	}
});

export default PaymentMethods;
