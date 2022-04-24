import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Formik } from 'formik';
import Button from '../components/global/Button';
import { useEditStoreMutation, useStoreQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import useGoBack from '../hooks/useGoBack';
import Input from '../components/global/Input';

const EditStore: React.FC = () => {
	const { goBack } = useNavigation();
	const { params } = useRoute<RouteProp<AppStackParamList, 'Edit Store'>>();
	const [{ data, fetching }] = useStoreQuery({
		variables: { storeId: params.storeId }
	});
	const [{ fetching: loading }, editStore] = useEditStoreMutation();
	useGoBack();

	const store = data?.store;

	if (fetching || !store) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Formik
				initialValues={{
					name: store.name,
					description: store.description ?? '',
					website: store.website ?? '',
					twitter: store.twitter ?? '',
					instagram: store.instagram ?? ''
				}}
				onSubmit={async values => {
					try {
						await editStore({
							storeId: params.storeId,
							input: values
						});
						goBack();
					} catch (error) {
						console.log(error);
					}
				}}
			>
				{({ values, handleChange, handleBlur, handleSubmit }) => (
					<>
						<Input
							label='Name'
							style={styles.input}
							placeholder='Name'
							value={values.name}
							onChangeText={handleChange('name')}
							onBlur={handleBlur('name')}
						/>
						<Input
							label='Website'
							style={styles.input}
							placeholder='https://acme.com'
							value={values.website}
							onChangeText={handleChange('website')}
							onBlur={handleBlur('website')}
							autoCorrect={false}
							autoCapitalize='none'
							keyboardType='url'
						/>
						<Input
							label='Description'
							style={[styles.input, { height: 80 }]}
							placeholder='Description'
							value={values.description}
							onChangeText={handleChange('description')}
							onBlur={handleBlur('description')}
							textArea
						/>
						<Input
							label='Twitter username'
							style={styles.input}
							placeholder='@acme_inc'
							value={values.twitter}
							onChangeText={handleChange('twitter')}
							onBlur={handleBlur('twitter')}
							autoCorrect={false}
							autoCapitalize='none'
						/>
						<Input
							label='Instagram username'
							style={styles.input}
							placeholder='@acme'
							value={values.instagram}
							onChangeText={handleChange('instagram')}
							onBlur={handleBlur('instagram')}
							autoCorrect={false}
							autoCapitalize='none'
						/>
						<Button
							style={styles.button}
							text='Edit store'
							loading={loading}
							onPress={handleSubmit}
						/>
					</>
				)}
			</Formik>
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

export default EditStore;
