import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		padding: 20,
		backgroundColor: '#FFFFFF'
	},
	title: {
		fontSize: 30,
		marginBottom: 5,
		color: '#000000',
		fontWeight: 'bold'
	},
	description: {
		fontSize: 16,
		marginBottom: 25,
		color: '#777777'
	},
	inputLabel: {
		textTransform: 'uppercase',
		fontSize: 12,
		marginBottom: 5,
		fontWeight: '500',
		color: '#777777'
	},
	input: {
		height: 45,
		padding: 10,
		fontSize: 16,
		borderRadius: 4,
		borderWidth: 2,
		marginBottom: 10,
		borderColor: '#777777'
	},
	button: {
		height: 45,
		backgroundColor: '#200200',
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonText: {
		fontWeight: 'bold',
		fontSize: 16,
		color: '#FFFFFF'
	}
});

export default styles;
