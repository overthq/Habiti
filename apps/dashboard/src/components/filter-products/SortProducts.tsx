import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import Radio from '../global/Radio';
import { FilterProductsFormValues } from '../../types/forms';
import AnimatedTypography from '../global/AnimatedTypography';
import { useAnimatedStyle, withTiming } from 'react-native-reanimated';

// FIXME: Using `value` and `fieldValue` feels very wrong.
// An `active` prop is probably much better.
// However, can't stop, won't stop.

interface RadioRowProps {
	title: string;
	value: FilterProductsFormValues['sortBy'];
	fieldValue: FilterProductsFormValues['sortBy'];
	onSelect(value: FilterProductsFormValues['sortBy']): () => void;
}

const RadioRow: React.FC<RadioRowProps> = ({
	title,
	value,
	fieldValue,
	onSelect
}) => {
	const active = React.useMemo(() => {
		return value === fieldValue;
	}, [value, fieldValue]);

	const style = useAnimatedStyle(() => {
		return { opacity: withTiming(active ? 1 : 0.5) };
	});

	return (
		<Pressable style={styles.option} onPress={onSelect(value)}>
			<AnimatedTypography style={style}>{title}</AnimatedTypography>
			<Radio active={value === fieldValue} />
		</Pressable>
	);
};

const SortProducts = () => {
	const { control, setValue } = useFormContext<FilterProductsFormValues>();

	const handleSortSelect =
		(value: FilterProductsFormValues['sortBy']) => () => {
			setValue('sortBy', value);
		};

	return (
		<Controller
			name='sortBy'
			control={control}
			render={({ field }) => (
				<View style={styles.container}>
					<RadioRow
						title='Default'
						value={undefined}
						fieldValue={field.value}
						onSelect={handleSortSelect}
					/>
					<RadioRow
						title='Newest to oldest'
						value='created-at-desc'
						fieldValue={field.value}
						onSelect={handleSortSelect}
					/>
					<RadioRow
						title='Highest to lowest price'
						value='unit-price-desc'
						fieldValue={field.value}
						onSelect={handleSortSelect}
					/>
					<RadioRow
						title='Lowest to highest price'
						value='unit-price-asc'
						fieldValue={field.value}
						onSelect={handleSortSelect}
					/>
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

export default SortProducts;
