import React from 'react';
import { View, StyleSheet } from 'react-native';

import Button from './Button';
import Screen from './Screen';
import Typography from './Typography';

interface EmptyStateProps {
	title: string;
	description: string;
	cta?: {
		text: string;
		action(): void;
	};
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, cta }) => {
	return (
		<Screen style={styles.container}>
			<View>
				<Typography weight='medium' size='large' style={styles.text}>
					{title}
				</Typography>
				<Typography variant='secondary' style={styles.text}>
					{description}
				</Typography>
				{cta ? (
					<Button text={cta.text} onPress={cta.action} style={styles.button} />
				) : null}
			</View>
		</Screen>
	);
};

const styles = StyleSheet.create({
	text: {
		textAlign: 'center'
	},
	container: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	button: {
		marginTop: 16
	}
});

export default EmptyState;
