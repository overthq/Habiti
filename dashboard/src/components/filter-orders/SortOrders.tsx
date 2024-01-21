import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import Typography from '../global/Typography';
import Radio from '../global/Radio';
import { FilterOrdersFormValues } from '../../types/forms';

// TODO: Add sorting by total

const SortOrders = () => {
	const { control, setValue } = useFormContext<FilterOrdersFormValues>();

	return (
		<View style={styles.container}>
			<Controller
				name='sortBy'
				control={control}
				render={({ field }) => (
					<>
						<Pressable
							style={styles.option}
							onPress={() => setValue('sortBy', undefined)}
						>
							<Typography>Default</Typography>
							<Radio active={field.value === undefined} />
						</Pressable>
						<Pressable
							style={styles.option}
							onPress={() => setValue('sortBy', 'created-at-desc')}
						>
							<Typography>Newest</Typography>
							<Radio active={field.value === 'created-at-desc'} />
						</Pressable>
					</>
				)}
			/>
		</View>
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
