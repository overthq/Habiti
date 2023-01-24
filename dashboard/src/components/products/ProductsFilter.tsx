import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Icon } from '../Icon';
import { FilterButton } from '../orders/OrdersFilter';

const ProductsFilter = () => {
	const handleChangeStatus = () => () => {
		// Do something
	};

	return (
		<View style={styles.container}>
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
			<Pressable>
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
		borderBottomWidth: 1,
		borderBottomColor: '#E3E3E3'
	},
	button: {
		marginRight: 16
	},
	text: {
		fontSize: 16
	}
});

export default ProductsFilter;
