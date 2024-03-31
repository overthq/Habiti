import React from 'react';
import { View } from 'react-native';

interface SpacerProps {
	x?: number;
	y?: number;
}

const Spacer: React.FC<SpacerProps> = ({ x, y }) => {
	return <View style={{ height: y, width: x }} />;
};

export default Spacer;
