import { Icon } from '@market/components';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useAddToWatchlistMutation } from '../../types/api';

interface WatchlistButtonProps {
	productId: string;
}

const WatchlistButton: React.FC<WatchlistButtonProps> = ({ productId }) => {
	const [, addToWatchlist] = useAddToWatchlistMutation();

	const handlePress = async () => {
		await addToWatchlist({ productId });
	};

	return (
		<Pressable style={styles.container} onPress={handlePress}>
			<Icon name='bookmark' />
		</Pressable>
	);
};
const styles = StyleSheet.create({
	container: {
		height: 32,
		width: 32,
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		position: 'absolute',
		top: 16,
		right: 16,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default WatchlistButton;
