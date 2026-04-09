import React from 'react';
import { View } from 'react-native';

import EditStoreMain from '../components/edit-store/EditStoreMain';
import { useCurrentStoreQuery } from '../data/queries';

const EditStore = () => {
	const { isFetching, data } = useCurrentStoreQuery();

	if (isFetching || !data?.store) {
		return <View />;
	}

	return <EditStoreMain store={data.store} />;
};

export default EditStore;
