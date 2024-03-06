import { TextButton } from '@market/components';
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface ExploreHeaderProps {
	searchOpen: boolean;
	setSearchOpen(value: boolean): void;
}

const ExploreHeader: React.FC<ExploreHeaderProps> = ({
	searchOpen,
	setSearchOpen
}) => {
	return (
		<View style={styles.container}>
			<View>
				<TextInput />
			</View>
			{searchOpen ? (
				<TextButton onPress={() => setSearchOpen(false)}>Cancel</TextButton>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {}
});

export default ExploreHeader;
