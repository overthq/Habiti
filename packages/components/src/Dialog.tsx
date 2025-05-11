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

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: theme.input.background },
				style
			]}
		>
			<View style={styles.header}>
				<Typography weight='medium'>{title}</Typography>
			</View>
			<Spacer y={2} />
			<Typography style={{ marginRight: 18 }} size='small' variant='secondary'>
				{description}
			</Typography>
		</View>
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
