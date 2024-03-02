import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		padding: 16
	},
	title: {
		fontSize: 30,
		marginBottom: 4,
		fontWeight: 'bold'
	},
	description: {
		marginBottom: 24
	},
	inputLabel: {
		textTransform: 'uppercase',
		fontSize: 12,
		marginBottom: 4,
		fontWeight: '500'
	},
	input: {
		height: 45,
		padding: 8,
		fontSize: 16,
		borderRadius: 4,
		borderWidth: 2,
		marginBottom: 8,
		borderColor: '#777777'
	}
});

export default styles;
