import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

import FormInput from '../global/FormInput';
import useStore from '../../state';
import { StoreQuery, useEditStoreMutation } from '../../types/api';

interface EditStoreFormData {
	name: string;
	description: string;
	website: string;
	twitter: string;
	instagram: string;
}

interface EditStoreMainProps {
	store: StoreQuery['currentStore'];
}

const EditStoreMain: React.FC<EditStoreMainProps> = ({ store }) => {
	const { goBack, setOptions } = useNavigation();
	const [, editStore] = useEditStoreMutation();
	const activeStore = useStore(state => state.activeStore);

	const formMethods = useForm<EditStoreFormData>({
		defaultValues: {
			name: store.name,
			description: store.description ?? '',
			website: store.website ?? '',
			twitter: store.twitter ?? '',
			instagram: store.instagram ?? ''
		}
	});

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<Pressable
					style={styles.headerButton}
					onPress={formMethods.handleSubmit(onSubmit)}
					disabled={!formMethods.formState.isDirty}
				>
					<Text style={styles.headerButtonText}>Save</Text>
				</Pressable>
			)
		});
	}, []);

	const onSubmit = React.useCallback(
		async (values: EditStoreFormData) => {
			try {
				if (activeStore) {
					await editStore({ storeId: activeStore, input: values });
					goBack();
				}
			} catch (error) {
				console.log(error);
			}
		},
		[activeStore]
	);

	return (
		<View style={styles.container}>
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
	headerButton: {
		marginRight: 16
	},
	headerButtonText: {
		fontSize: 16
	},
	button: {
		marginTop: 8
	}
});

export default EditStoreMain;
