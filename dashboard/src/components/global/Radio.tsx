import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

interface RadioProps {
	active: boolean;
}

const Radio: React.FC<RadioProps> = ({ active }) => {
	return <View style={styles.circle}>{active && <Animated.View />}</View>;
};

const styles = StyleSheet.create({
	circle: {},
	dot: {}
});

export default Radio;
