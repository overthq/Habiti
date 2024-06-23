import { Typography } from '@habiti/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Checklist = () => {
	return (
		<View style={styles.container}>
			<Typography>
				Complete the following tasks to have your store fully set up.
			</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
		borderRadius: 6
	}
});

export default Checklist;
