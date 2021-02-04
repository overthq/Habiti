import React from 'react';
import { View, StyleSheet } from 'react-native';

// What should this screen contain?
// Just a form to edit the item?
// Maybe not, but we need an EditItem screen for that.
const Item: React.FC = () => {
	return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Item;
