import { Radio, Typography } from '@market/components';
import React from 'react';
import { Controller } from 'react-hook-form';
import { View, Pressable, StyleSheet } from 'react-native';

import { FilterOrdersFormValues } from '../../types/forms';

const SortOrders = () => {
	return (
		<Controller<FilterOrdersFormValues>
			name='sortBy'
			render={({ field }) => (
				<View style={styles.container}>
					<Pressable
						style={styles.option}
						onPress={() => field.onChange(undefined)}
					>
						<Typography>Default</Typography>
						<Radio active={field.value === undefined} />
					</Pressable>
					<Pressable
						style={styles.option}
						onPress={() => field.onChange('created-at-desc')}
					>
						<Typography>Newest</Typography>
						<Radio active={field.value === 'created-at-desc'} />
					</Pressable>
					<Pressable
						style={styles.option}
						onPress={() => field.onChange('total-desc')}
					>
						<Typography>Total (Highest to lowest)</Typography>
						<Radio active={field.value === 'total-desc'} />
					</Pressable>
				</View>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 8
	},
	option: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 4,
		paddingRight: 2
	}
});

export default SortOrders;
