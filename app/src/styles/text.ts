import { StyleSheet } from 'react-native';

export const colorStyles = {
	primary: '#000000',
	secondary: '#505050',
	tertiary: '#C4C4C4'
};

const textStyles = StyleSheet.create({
	title: {
		fontSize: 32
	},
	sectionHeader: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#505050',
		marginVertical: 8
	},
	regular: {
		fontSize: 16
	}
});

export default textStyles;
