import React from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	Dimensions,
	Pressable
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFormikContext } from 'formik';
import { Icon } from '../Icon';

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
			{values.storeImage ? (
				<View style={styles.preview}>
					<Image source={{ uri: values.storeImage }} style={styles.image} />
					<Pressable
						onPress={() => setFieldValue('storeImage', null)}
						style={styles.close}
					>
						<Icon name='x' size={20} color='#FFFFFF' />
					</Pressable>
				</View>
			) : (
				<Pressable style={styles.upload} onPress={handlePickImage}>
					<Icon name='upload' size={32} color='#505050' />
				</Pressable>
			)}
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
		height: '100%',
		borderRadius: 75
	},
	preview: {
		height: 150,
		width: 150,
		alignSelf: 'center',
		marginVertical: 16
	},
	upload: {
		height: 150,
		width: 150,
		backgroundColor: '#D3D3D3',
		borderRadius: 75,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		marginVertical: 16
	},
	close: {
		height: 28,
		width: 28,
		borderRadius: 14,
		backgroundColor: '#000000',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		top: 6,
		right: 6,
		zIndex: 100
	}
});

export default StoreImage;
