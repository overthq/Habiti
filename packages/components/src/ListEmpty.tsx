import React from 'react';
import { View, Pressable, ViewStyle, StyleSheet } from 'react-native';

import Typography from './Typography';
import Spacer from './Spacer';

const colors = {
	dark: {
		button: {
			background: '#D3D3D3',
			text: '#2B2B2B'
		}
	},
	light: {
		button: {
			background: '#D3D3D3',
			text: '#2B2B2B'
		}
	}
} as const;

interface ListEmptyButtonProps {
	text: string;
	onPress(): void;
}

const ListEmptyButton: React.FC<ListEmptyButtonProps> = ({ text, onPress }) => (
	<Pressable
		style={[
			buttonStyles.container,
			{ backgroundColor: colors.light.button.background }
		]}
		onPress={onPress}
	>
		<Typography weight='medium' style={{ color: colors.light.button.text }}>
			{text}
		</Typography>
	</Pressable>
);

const buttonStyles = StyleSheet.create({
	container: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		marginVertical: 4,
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

interface ListEmptyProps {
	title?: string;
	description: string;
	cta?: { text: string; action(): void };
	viewStyle?: ViewStyle;
}

const ListEmpty: React.FC<ListEmptyProps> = ({
	title,
	description,
	cta,
	viewStyle
}) => (
	<View style={[styles.container, viewStyle]}>
		{title && (
			<>
				<Typography size='xxlarge' weight='medium'>
					{title}
				</Typography>
				<Spacer y={12} />
			</>
		)}
		<Typography variant='secondary' style={styles.description}>
			{description}
		</Typography>
		{cta && <ListEmptyButton text={cta.text} onPress={cta.action} />}
	</View>
);

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		justifyContent: 'center',
		alignItems: 'center'
	},
	description: {
		textAlign: 'center',
		marginVertical: 8
	}
});

export default ListEmpty;
