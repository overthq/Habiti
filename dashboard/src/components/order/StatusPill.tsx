import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { OrderStatus } from '../../types/api';

const StatusColorMap = {
	[OrderStatus.Cancelled]: {
		backgroundColor: '#D3D3D3',
		textColor: '#000000'
	},
	[OrderStatus.Completed]: {
		backgroundColor: '#D3D3D3',
		textColor: '#000000'
	},
	[OrderStatus.Delivered]: {
		backgroundColor: '#D3D3D3',
		textColor: '#000000'
	},
	[OrderStatus.Pending]: {
		backgroundColor: '#D3D3D3',
		textColor: '#000000'
	},
	[OrderStatus.Processing]: {
		backgroundColor: '#D3D3D3',
		textColor: '#000000'
	}
} as const;

interface StatusPillProps {
	status: OrderStatus;
}

const StatusPill: React.FC<StatusPillProps> = ({ status }) => (
	<View
		style={[
			styles.pill,
			{ backgroundColor: StatusColorMap[status].backgroundColor }
		]}
	>
		<Text style={[styles.text, { color: StatusColorMap[status].textColor }]}>
			{status}
		</Text>
	</View>
);

const styles = StyleSheet.create({
	pill: {
		padding: 4,
		borderRadius: 4
	},
	text: {
		fontWeight: '500'
	}
});

export default StatusPill;
