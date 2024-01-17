import React from 'react';
import { View, StyleSheet } from 'react-native';

interface CheckBoxProps {
	active?: boolean;
}

const Checkbox: React.FC<CheckBoxProps> = ({ active }) => {
	return <View style={styles.square}>{active && <View />}</View>;
};

const styles = StyleSheet.create({
	square: {
		height: 20,
		width: 20,
		borderRadius: 4
	}
});

export default Checkbox;
