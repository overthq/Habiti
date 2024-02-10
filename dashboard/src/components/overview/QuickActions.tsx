import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Typography from '../global/Typography';
import { Icon } from '../Icon';

const QuickActions = () => {
	return (
		<View style={styles.container}>
			<Pressable>
				<Typography>5 orders</Typography>
				<Icon name='chevron-right' />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {}
});

export default QuickActions;
