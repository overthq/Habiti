import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
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
		<View>
			<Text style={[styles.label, { color: theme.input.label }]}>Bank</Text>
			<Pressable
				style={[styles.button, { backgroundColor: theme.input.background }]}
				onPress={onPress}
			>
				<Typography style={{ color: theme.input.text }}>
					{field.value ? BANKS_BY_CODE[field.value].name : 'Select Bank'}
				</Typography>
				<Icon name='chevron-down' />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	label: {
		marginBottom: 4,
		fontSize: 14,
		fontWeight: '500'
	},
	button: {
		paddingHorizontal: 8,
		height: 40,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderRadius: 4,
		marginBottom: 8
	}
});

export default BankSelectButton;