import React from 'react';
import { FlatList, View, StyleSheet, type ListRenderItem } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input, Row, Typography, useTheme } from '@habiti/components';

import { BANKS } from '../utils/banks';
import { PayoutAccountStackScreenProps } from '../navigation/types';

interface BankRowProps {
	item: (typeof BANKS)[number];
	onSelect: (code: string) => void;
}

const BankRow = React.memo(({ item, onSelect }: BankRowProps) => (
	<Row style={styles.row} onPress={() => onSelect(item.code)}>
		<Typography>{item.name}</Typography>
	</Row>
));

const SelectBank: React.FC<
	PayoutAccountStackScreenProps<'PayoutAccount.SelectBank'>
> = ({ navigation }) => {
	const { theme } = useTheme();
	const { bottom } = useSafeAreaInsets();
	const [query, setQuery] = React.useState('');

	const banks = React.useMemo(() => {
		const normalized = query.trim().toLowerCase();

		if (!normalized) return BANKS;

		return BANKS.filter(bank => bank.name.toLowerCase().includes(normalized));
	}, [query]);

	const handleSelect = React.useCallback(
		(bankCode: string) => {
			navigation.navigate('PayoutAccount.EnterAccount', { bankCode });
		},
		[navigation]
	);

	const renderItem = React.useCallback<ListRenderItem<(typeof BANKS)[number]>>(
		({ item }) => <BankRow item={item} onSelect={handleSelect} />,
		[handleSelect]
	);

	return (
		<View
			style={[styles.container, { backgroundColor: theme.screen.background }]}
		>
			<View style={styles.header}>
				<Input
					value={query}
					onChangeText={setQuery}
					placeholder='Search banks'
					autoCapitalize='none'
					autoCorrect={false}
				/>
			</View>
			<FlatList
				data={banks}
				keyExtractor={bank => bank.id.toString()}
				keyboardShouldPersistTaps='handled'
				renderItem={renderItem}
				contentContainerStyle={{ paddingBottom: bottom }}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	header: {
		paddingHorizontal: 16,
		paddingVertical: 12
	},
	row: {
		paddingVertical: 12
	}
});

export default SelectBank;
