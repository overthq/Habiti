import React from 'react';
import { View, StyleSheet } from 'react-native';

import Typography from './Typography';

interface ScreenHeaderProps {
	title: string;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title }) => {
	return (
		<View style={styles.container}>
			<Typography size='xxxlarge' weight='bold'>
				{title}
			</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingVertical: 12
	}
});

export default ScreenHeader;
