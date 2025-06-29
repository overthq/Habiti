import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Button } from '@habiti/components';

import { useProductContext } from './ProductContext';

const CartButton: React.FC = () => {
	const {
		onCartCommit,
		cartCommitDisabled,
		cartCommitText,
		cartCommitFetching
	} = useProductContext();

	return (
		<Button
			loading={cartCommitFetching}
			onPress={onCartCommit}
			text={cartCommitText}
			disabled={cartCommitDisabled}
			style={styles.button}
		/>
	);
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
	button: {
		width: (width - 16 * 3) / 2
	}
});

export default CartButton;
