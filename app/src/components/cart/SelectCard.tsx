import React from 'react';
import {
	View,
	Text,
	Pressable,
	ActivityIndicator,
	StyleSheet
} from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCardsQuery } from '../../types/api';
import { Icon } from '../Icon';

interface SelectCardProps {
	selectedCard?: string;
	handleCardSelect(cardId: string): void;
}

const SelectCard: React.FC<SelectCardProps> = ({
	selectedCard,
	handleCardSelect
}) => {
	const [{ data, fetching }] = useCardsQuery();
	const cards = data?.currentUser.cards;
	const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

	const handleOpenModal = React.useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

	const displayCard = React.useMemo(() => {
		if (selectedCard) {
			return cards?.find(c => c.id === selectedCard);
		} else if (cards && cards[0]) {
			return cards[0];
		}
	}, [selectedCard]);

	if (fetching) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<>
			<View style={styles.container}></View>
			<Pressable onPress={handleOpenModal}>
				{displayCard ? (
					<Text>**** {displayCard.last4}</Text>
				) : (
					<Text>Add card</Text>
				)}
			</Pressable>
			<BottomSheetModal
				index={0}
				ref={bottomSheetModalRef}
				snapPoints={['25%']}
				style={styles.modal}
				backgroundStyle={styles.modalBackground}
			>
				<Text style={{ fontSize: 18, fontWeight: '500' }}>Select card</Text>
				{cards?.map(card => (
					<Pressable
						key={card.id}
						onPress={() => handleCardSelect(card.id)}
						style={styles.row}
					>
						<Text>**** {card.last4}</Text>
						{selectedCard && selectedCard === card.id && <Icon name='check' />}
					</Pressable>
				))}
			</BottomSheetModal>
		</>
	);
};

const styles = StyleSheet.create({
	container: {},
	loading: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	modal: {
		paddingHorizontal: 16,
		paddingTop: 8
	},
	modalBackground: {
		backgroundColor: '#DBDBDB'
	}
});

export default SelectCard;
