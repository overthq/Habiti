import { StyleSheet } from 'react-native';

export const colors = {
	primary: '#000000',
	secondary: '#505050',
	tertiary: '#C4C4C4'
};

const textStyles = StyleSheet.create({
	title: {
		fontSize: 32
	},
	sectionHeader: {
		fontSize: 18,
		fontWeight: '500',
		color: '#505050',
		marginTop: 16,
		marginBottom: 8
	},
	body: {
		fontSize: 16
	}
});

export default textStyles;
