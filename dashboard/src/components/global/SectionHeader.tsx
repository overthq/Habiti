import React from 'react';
import { View } from 'react-native';
import Typography from './Typography';

interface SectionHeaderProps {
	title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
	return (
		<View>
			<Typography>{title}</Typography>
		</View>
	);
};

export default SectionHeader;
