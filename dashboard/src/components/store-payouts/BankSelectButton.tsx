import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Icon } from '../Icon';
import { BANKS_BY_CODE } from '../../utils/transform';
import Typography from '../global/Typography';
import useTheme from '../../hooks/useTheme';

// While this shares significant style similarities with the generic <Button>
// component, it is weirdly specific in certain ways.
// Because this is the only case where we utilize this component, I am making
// a conscious decision to make it a separate component.
// If deemed expedient in the future, we should make this a variant of <Button>.

interface BankSelectButtonProps<T extends FieldValues> {
	control: Control<T>;
	onPress(): void;
}

const BankSelectButton = <T extends FieldValues>({
	control,
	onPress
}: BankSelectButtonProps<T>) => {
	const { field } = useController({ control, name: 'bank' as Path<T> });
	const { theme } = useTheme();

	return (
		<Pressable
			style={[styles.container, { backgroundColor: theme.input.background }]}
			onPress={onPress}
		>
			<Typography style={{ color: theme.input.text }}>
				{field.value ? BANKS_BY_CODE[field.value].name : 'Select Bank'}
			</Typography>
			<Icon name='chevron-down' />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 40
	},
	button: {
		paddingHorizontal: 8,
		height: 40,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderRadius: 4
	}
});

export default BankSelectButton;
