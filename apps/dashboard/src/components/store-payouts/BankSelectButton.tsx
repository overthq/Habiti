import { useTheme, Icon, Typography } from '@market/components';
import React from 'react';
import { Control, useController } from 'react-hook-form';
import { Pressable, View, StyleSheet } from 'react-native';

import { EditPayoutInfoFormValues } from '../../types/forms';
import { BANKS_BY_CODE } from '../../utils/transform';

// While this shares significant style similarities with the generic <Button>
// component, it is weirdly specific in certain ways.
// Because this is the only case where we utilize this component, I am making
// a conscious decision to make it a separate component.
// If deemed expedient in the future, we should make this a variant of <Button>.

interface BankSelectButtonProps {
	control: Control<EditPayoutInfoFormValues>;
	onPress(): void;
}

const BankSelectButton: React.FC<BankSelectButtonProps> = ({
	control,
	onPress
}) => {
	const { field } = useController({ control, name: 'bank' });
	const { theme } = useTheme();

	return (
		<View>
			<Typography
				size='small'
				weight='medium'
				style={[styles.label, { color: theme.input.label }]}
			>
				Bank
			</Typography>
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
		marginBottom: 4
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
