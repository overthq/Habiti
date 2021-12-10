import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFormikContext } from 'formik';
import Button from '../global/Button';

const { width } = Dimensions.get('window');

const StoreImage: React.FC = () => {
	const { values, setFieldValue } = useFormikContext<{ storeImage: string }>();

	const handlePickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1
		});

		if (!result.cancelled) setFieldValue('storeImage', result.uri);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Store Image</Text>
			<View style={styles.preview}>
				{values.storeImage ? (
					<Image source={{ uri: values.storeImage }} style={styles.image} />
				) : null}
			</View>
			<Button onPress={handlePickImage} text='Upload' />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width,
		padding: 16
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold'
	},
	image: {
		width: '100%',
		height: '100%'
	},
	preview: {
		height: 150,
		width: 150,
		borderRadius: 75,
		backgroundColor: '#D3D3D3'
	}
});

export default StoreImage;
