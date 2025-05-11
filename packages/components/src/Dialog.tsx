import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
	LinearTransition,
	FadeInDown,
	FadeOutUp
} from 'react-native-reanimated';

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
			entering={FadeInDown}
			exiting={FadeOutUp}
			layout={LinearTransition}
			style={[
				styles.container,
				{ backgroundColor: theme.input.background },
				style
			]}
		>
			<View style={styles.header}>
				<Typography weight='medium' size='large'>
					{title}
				</Typography>
				<TouchableOpacity onPress={handleClose}>
					<Icon name='x' size={20} />
				</TouchableOpacity>
			</View>
			{/* <Spacer y={2} /> */}
			<Typography style={{ marginRight: 18 }} size='small' variant='secondary'>
				{description}
			</Typography>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 6,
		padding: 12
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	}
});

export default Dialog;
