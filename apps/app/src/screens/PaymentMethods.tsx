import {
	Icon,
	ListEmpty,
	Screen,
	Typography,
	useTheme
} from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import React from 'react';
import {
	View,
	StyleSheet,
	ActivityIndicator,
	Pressable,
	FlatList
} from 'react-native';

import { MastercardIcon } from '../components/cart/CardIcons';
import useGoBack from '../hooks/useGoBack';
import { AppStackParamList } from '../types/navigation';
import { useCardsQuery } from '../types/api';

const PaymentMethods: React.FC = () => {
	const [{ data, fetching }] = useCardsQuery();
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();
	const { theme } = useTheme();
	useGoBack();

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<Pressable onPress={() => navigate('Add Card', { amount: 5000 })}>
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
			<FlatList
				style={{ flex: 1 }}
				contentContainerStyle={{ flexGrow: 1 }}
				data={cards}
				keyExtractor={c => c.id}
				renderItem={({ item: card }) => (
					<Pressable
						style={[styles.card, { borderBottomColor: theme.border.color }]}
					>
						<MastercardIcon />
						<Typography
							style={styles.capitalize}
						>{`${card.cardType} \u2022\u2022\u2022\u2022${card.last4}`}</Typography>
					</Pressable>
				)}
				ListEmptyComponent={() => (
					<ListEmpty
						title='No cards added'
						description='When you add your cards, they will be displayed here.'
						cta={{
							text: 'Add card',
							action: () => navigate('Add Card', { amount: 5000 })
						}}
						viewStyle={{ flex: 1 }}
					/>
				)}
			/>
		</Screen>
	);
};

const styles = StyleSheet.create({
	sectionHeader: {
		marginTop: 16,
		marginBottom: 8,
		marginLeft: 16
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
	}
});

export default PaymentMethods;
