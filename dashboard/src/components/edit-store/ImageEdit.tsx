import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const ImageEdit = () => {
	return (
		<View style={styles.container}>
			<Image source={{ uri: '' }} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {}
});

export default ImageEdit;
