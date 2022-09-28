import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
// import { useFormikContext } from 'formik';

const ImageEdit = () => {
	// const l = useFormikContext();

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
