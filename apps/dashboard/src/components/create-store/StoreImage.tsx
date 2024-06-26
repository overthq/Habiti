import { Screen, Icon, Typography, useTheme } from '@habiti/components';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { View, Image, StyleSheet, Dimensions, Pressable } from 'react-native';

import { CreateStoreFormValues } from '../../screens/CreateStore';

const { width } = Dimensions.get('window');

const StoreImage: React.FC = () => {
	const { setValue, control } = useFormContext<CreateStoreFormValues>();
	const { theme } = useTheme();

	const handlePickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1
		});

		if (!result.canceled) setValue('storeImage', result.assets?.[0].uri);
	};

	const removeImage = React.useCallback(() => {
		setValue('storeImage', undefined);
	}, []);

	return (
		<Screen style={styles.container}>
			<Typography size='xxxlarge' weight='bold'>
				Store Image
			</Typography>
			<Controller
				name='storeImage'
				control={control}
				render={({ field: { value } }) =>
					value ? (
						<View style={styles.preview}>
							<Image source={{ uri: value }} style={styles.image} />
							<Pressable onPress={removeImage} style={styles.close}>
								<Icon name='x' size={20} color={theme.text.tertiary} />
							</Pressable>
						</View>
					) : (
						<Pressable style={styles.upload} onPress={handlePickImage}>
							<Icon name='upload' size={32} color='#505050' />
						</Pressable>
					)
				}
			/>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width,
		padding: 16
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
