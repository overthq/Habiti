import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

import FormInput from '../global/FormInput';
import { StoreQuery, useEditStoreMutation } from '../../types/api';
import TextButton from '../global/TextButton';
import Screen from '../global/Screen';

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
	const [{ fetching }, editStore] = useEditStoreMutation();

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
				<View style={styles.headerAction}>
					{fetching ? (
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
	}, [fetching, formMethods.formState.isDirty]);

	const onSubmit = React.useCallback(async (values: EditStoreFormData) => {
		try {
			await editStore({ input: values });
			goBack();
		} catch (error) {
			console.log(error);
		}
	}, []);

	return (
		<Screen style={styles.container}>
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
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	input: {
		borderRadius: 4,
		marginBottom: 8
	},
	headerAction: {
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
