import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ManagersQuery } from '../../types/api';
import Typography from '../global/Typography';

interface ManagerRowProps {
	manager: ManagersQuery['currentStore']['managers'][number]['manager'];
	you: boolean;
}

const ManagerRow: React.FC<ManagerRowProps> = ({ manager, you }) => {
	return (
		<View style={styles.container}>
			<Typography>{manager.name}</Typography>
			{you && (
				<View style={styles.you}>
					<Typography size='small' weight='medium' style={styles.youText}>
						You
					</Typography>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	you: {
		marginLeft: 8,
		paddingVertical: 4,
		backgroundColor: '#D3D3D3',
		borderRadius: 16,
		paddingHorizontal: 8
	},
	youText: {
		color: '#505050'
	}
});

export default ManagerRow;
