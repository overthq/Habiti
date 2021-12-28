import React from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import Button from '../components/global/Button';

const AddCard = () => {
	return (
		<View style={styles.container}>
			<Formik
				initialValues={{
					cardNumber: '',
					cvv: '',
					expiryMonth: '',
					expiryYear: ''
				}}
				onSubmit={values => {
					Alert.alert(JSON.stringify(values));
				}}
			>
				{({ values, handleChange, handleBlur, handleSubmit }) => (
					<>
						<TextInput
							value={values.cardNumber}
							onChangeText={handleChange('cardNumber')}
							onBlur={handleBlur('cardNumber')}
						/>
						<TextInput
							value={values.expiryMonth}
							onChangeText={handleChange('expiryMonth')}
							onBlur={handleBlur('expiryMonth')}
						/>
						<TextInput
							value={values.expiryYear}
							onChangeText={handleChange('expiryYear')}
							onBlur={handleBlur('expiryYear')}
						/>
						<TextInput
							value={values.cvv}
							onChangeText={handleChange('cvv')}
							onBlur={handleBlur('cvv')}
						/>
						<Button text='Add Card' onPress={handleSubmit} />
					</>
				)}
			</Formik>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default AddCard;
