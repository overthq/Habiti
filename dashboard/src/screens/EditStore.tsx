import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useStoreQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import useGoBack from '../hooks/useGoBack';
import EditStoreMain from '../components/edit-store/EditStoreMain';

const EditStore: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Edit Store'>>();
	const [{ data, fetching }] = useStoreQuery({
		variables: { storeId: params.storeId }
	});

	useGoBack();

	const store = data?.store;

	if (fetching || !store) {
		return <View style={styles.loading} />;
	}

	return <EditStoreMain store={store} />;
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 16,
		paddingHorizontal: 16,
		backgroundColor: '#FFFFFF'
	},
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFFFFF'
	},
	input: {
		borderRadius: 4,
		marginBottom: 8
	},
	button: {
		marginTop: 8
	}
});

export default EditStore;
