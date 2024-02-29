import { useTheme, Icon } from '@market/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { AppStackParamList } from '../../types/navigation';
import { FilterButton } from '../orders/OrdersFilter';

const ProductsFilter = () => {
	const { theme } = useTheme();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const handleChangeStatus = () => () => {
		// Do something
	};

	const handleOpenFilterSheet = () => {
		navigate('FilterProducts');
	};

	return (
		<View style={[styles.container, { borderBottomColor: theme.border.color }]}>
			<View style={{ flexDirection: 'row' }}>
				<FilterButton text='All' onPress={handleChangeStatus()} active />
				<FilterButton
					text='Active'
					onPress={handleChangeStatus()}
					active={false}
				/>
				<FilterButton
					text='Draft'
					onPress={handleChangeStatus()}
					active={false}
				/>
			</View>
			<Pressable onPress={handleOpenFilterSheet}>
				<Icon name='filter' size={20} />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderBottomWidth: 0.5
	},
	button: {
		marginRight: 16
	},
	text: {
		fontSize: 16
	}
});

export default ProductsFilter;
