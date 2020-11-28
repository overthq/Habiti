import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FollowedStoresEmpty = () => {
	const { navigate } = useNavigation();

	return (
		<View style={styles.container}>
			<Text style={styles.text}></Text>
			<TouchableOpacity
				style={styles.button}
				onPress={() => navigate('Explore')}
			>
				<Text style={styles.buttonText}>Find stores you may like</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%'
	},
	text: {
		fontSize: 12,
		color: '#D3D3D3'
	},
	button: {
		padding: 15,
		backgroundColor: '#505050',
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonText: {
		color: '#D3D3D3',
		fontWeight: '500',
		fontSize: 14
	}
});

export default FollowedStoresEmpty;
