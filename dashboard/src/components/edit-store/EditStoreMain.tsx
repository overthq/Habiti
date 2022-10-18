import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

import useStore from '../../state';
import { StoreQuery, useEditStoreMutation } from '../../types/api';
import Button from '../global/Button';
import FormInput from '../global/FormInput';

interface EditStoreFormData {
	name: string;
	description: string;
	website: string;
	twitter: string;
	instagram: string;
}

interface EditStoreMainProps {
	store: StoreQuery['store'];
}

const EditStoreMain: React.FC<EditStoreMainProps> = ({ store }) => {
	const { goBack } = useNavigation();
	const [{ fetching }, editStore] = useEditStoreMutation();
	const activeStore = useStore(state => state.activeStore);

	const { control, handleSubmit } = useForm<EditStoreFormData>({
		defaultValues: {
			name: store.name,
			description: store.description ?? '',
			website: store.website ?? '',
			twitter: store.twitter ?? '',
			instagram: store.instagram ?? ''
		}
	});

	const onSubmit = async (values: EditStoreFormData) => {
		try {
			if (activeStore) {
				await editStore({ storeId: activeStore, input: values });
				goBack();
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<View style={styles.container}>
			<FormInput
				name='name'
				label='Name'
				style={styles.input}
				placeholder='Name'
				control={control}
			/>
			<FormInput
				name='website'
				label='Website'
				style={styles.input}
				placeholder='https://acme.com'
				autoCorrect={false}
				autoCapitalize='none'
				keyboardType='url'
				control={control}
			/>
			<FormInput
				name='description'
				label='Description'
				style={[styles.input, { height: 80 }]}
				placeholder='Description'
				textArea
				control={control}
			/>
			<FormInput
				name='twitter'
				label='Twitter username'
				style={styles.input}
				placeholder='@acme_inc'
				autoCorrect={false}
				autoCapitalize='none'
				control={control}
			/>
			<FormInput
				name='instagram'
				label='Instagram username'
				style={styles.input}
				placeholder='@acme'
				autoCorrect={false}
				autoCapitalize='none'
				control={control}
			/>
			<Button
				style={styles.button}
				text='Edit store'
				loading={fetching}
				onPress={handleSubmit(onSubmit)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 16,
		paddingHorizontal: 16,
		backgroundColor: '#FFFFFF'
	},
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	input: {
		borderRadius: 4,
		marginBottom: 8
	},
	button: {
		marginTop: 8
	}
});

export default EditStoreMain;
