import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';

const ImageEdit = () => {
	const l = useFormikContext();

	return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
	container: {}
});

export default ImageEdit;
