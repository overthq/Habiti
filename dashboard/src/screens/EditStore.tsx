import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useStoreQuery } from '../types/api';
import useGoBack from '../hooks/useGoBack';
import EditStoreMain from '../components/edit-store/EditStoreMain';
import useStore from '../state';

const EditStore: React.FC = () => {
	const activeStore = useStore(({ activeStore }) => activeStore);
	const [{ data, fetching }] = useStoreQuery({
		variables: { storeId: activeStore as string }
	});

	useGoBack();

	const store = data?.store;

	if (fetching || !store) {
		return <View style={styles.loading} />;
	}

	return <EditStoreMain store={store} />;
};

const styles = StyleSheet.create({
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFFFFF'
	}
});

export default EditStore;
