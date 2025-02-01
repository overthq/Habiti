import { useTheme, Icon } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { AppStackParamList } from '../../types/navigation';
import { FilterButton } from '../orders/OrdersFilter';

const ProductsFilter = () => {
	const { theme } = useTheme();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const [status, setStatus] = React.useState<'all' | 'active' | 'draft'>('all');

	const handleChangeStatus = (s: typeof status) => () => {
		setStatus(s);
	};

	const handleOpenFilterSheet = () => {
		navigate('FilterProducts');
	};

	return (
		<View style={[styles.container, { borderBottomColor: theme.border.color }]}>
			<View style={{ flexDirection: 'row', gap: 12 }}>
				<FilterButton
					text='All'
					onPress={handleChangeStatus('all')}
					active={status === 'all'}
				/>
				<FilterButton
					text='Active'
					onPress={handleChangeStatus('active')}
					active={status === 'active'}
				/>
				<FilterButton
					text='Draft'
					onPress={handleChangeStatus('draft')}
					active={status === 'draft'}
				/>
			</View>
			<Pressable onPress={handleOpenFilterSheet}>
				<Icon name='sliders-horizontal' size={20} />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingBottom: 12,
		paddingHorizontal: 16,
		borderBottomWidth: 0.5
	}
});

export default ProductsFilter;
