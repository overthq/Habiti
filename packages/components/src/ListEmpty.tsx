// Temporarily create a ListEmpty file.
import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';

import ListEmptyButton from './ListEmptyButton';
import Typography from './Typography';
import Spacer from './Spacer';

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
