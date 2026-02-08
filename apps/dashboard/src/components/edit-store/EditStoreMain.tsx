import React from 'react';
import { StyleSheet, View, ActivityIndicator, Pressable } from 'react-native';
import { useForm } from 'react-hook-form';
import { Avatar, FormInput, Screen, TextButton } from '@habiti/components';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import { uploadImage } from '../../data/requests';
import { Store } from '../../data/types';
import { useUpdateCurrentStoreMutation } from '../../data/mutations';

interface EditStoreFormData {
	name: string;
	description: string;
	website: string;
	twitter: string;
	instagram: string;
	imageUrl: string;
	imagePublicId: string;
}

interface EditStoreMainProps {
	store: Store;
}

const EditStoreMain: React.FC<EditStoreMainProps> = ({ store }) => {
	const { goBack, setOptions } = useNavigation();
	const updateStoreMutation = useUpdateCurrentStoreMutation();
	const [imagePreview, setImagePreview] = React.useState(store.image?.path);
	const [uploading, setUploading] = React.useState(false);

	const formMethods = useForm<EditStoreFormData>({
		defaultValues: {
			name: store.name,
			description: store.description ?? '',
			website: store.website ?? '',
			twitter: store.twitter ?? '',
			instagram: store.instagram ?? '',
			imageUrl: '',
			imagePublicId: ''
		}
	});

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<View>
					{updateStoreMutation.isPending ? (
						<ActivityIndicator />
					) : (
						<TextButton
							onPress={formMethods.handleSubmit(onSubmit)}
							disabled={!formMethods.formState.isDirty}
						>
							Save
						</TextButton>
					)}
				</View>
			)
		});
	}, [updateStoreMutation.isPending, formMethods.formState.isDirty]);

	const handlePickImage = React.useCallback(async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8
		});

		if (result.canceled) return;

		const uri = result.assets[0].uri;
		setImagePreview(uri);

		try {
			setUploading(true);
			const { url, publicId } = await uploadImage(uri);
			formMethods.setValue('imageUrl', url, { shouldDirty: true });
			formMethods.setValue('imagePublicId', publicId);
		} catch (error) {
			console.log('Image upload failed:', error);
			setImagePreview(store.image?.path);
		} finally {
			setUploading(false);
		}
	}, [store.image?.path]);

	const onSubmit = React.useCallback(async (values: EditStoreFormData) => {
		try {
			const { imageUrl, imagePublicId, ...rest } = values;
			await updateStoreMutation.mutateAsync({
				...rest,
				...(imageUrl ? { imageUrl, imagePublicId } : {})
			});
			goBack();
		} catch (error) {
			console.log(error);
		}
	}, []);

	return (
		<Screen style={styles.container}>
			<Pressable
				style={styles.avatarSection}
				onPress={handlePickImage}
				disabled={uploading}
			>
				<Avatar uri={imagePreview} size={80} fallbackText={store.name} />
				<TextButton onPress={handlePickImage} disabled={uploading}>
					{uploading ? 'Uploading...' : 'Edit Photo'}
				</TextButton>
			</Pressable>
			<FormInput
				name='name'
				label='Name'
				style={styles.input}
				placeholder='Name'
				control={formMethods.control}
			/>
			<FormInput
				name='website'
				label='Website'
				style={styles.input}
				placeholder='https://acme.com'
				autoCorrect={false}
				autoCapitalize='none'
				keyboardType='url'
				control={formMethods.control}
			/>
			<FormInput
				name='description'
				label='Description'
				style={[styles.input, { height: 80 }]}
				placeholder='Description'
				textArea
				control={formMethods.control}
			/>
			<FormInput
				name='twitter'
				label='Twitter username'
				style={styles.input}
				placeholder='@acme_inc'
				autoCorrect={false}
				autoCapitalize='none'
				control={formMethods.control}
			/>
			<FormInput
				name='instagram'
				label='Instagram username'
				style={styles.input}
				placeholder='@acme'
				autoCorrect={false}
				autoCapitalize='none'
				control={formMethods.control}
			/>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 16,
		paddingHorizontal: 16
	},
	avatarSection: {
		alignItems: 'center',
		marginBottom: 16,
		gap: 8
	},
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	input: {
		marginBottom: 8
	},
	button: {
		marginTop: 8
	}
});

export default EditStoreMain;
