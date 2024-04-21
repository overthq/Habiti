import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { Icon } from './Icon';
import Spacer from './Spacer';
import { useTheme } from './Theme';
import Typography from './Typography';

interface DialogProps {
	title: string;
	description: string;
	style?: ViewStyle;
}

const Dialog: React.FC<DialogProps> = ({ title, description, style }) => {
	const { theme } = useTheme();
	const [open, setOpen] = React.useState(true);

	const handleClose = () => {
		setOpen(false);
	};

	if (!open) return null;

	return (
		<Animated.View
			layout={LinearTransition}
			style={[
				styles.container,
				{ backgroundColor: theme.input.background },
				style
			]}
		>
			<View style={styles.header}>
				<Typography weight='medium' size='xlarge'>
					{title}
				</Typography>
				<TouchableOpacity onPress={handleClose}>
					<Icon name='x' />
				</TouchableOpacity>
			</View>
			<Spacer y={2} />
			<Typography style={{ marginRight: 18 }} variant='secondary'>
				{description}
			</Typography>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 6,
		padding: 16
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	}
});

export default Dialog;
