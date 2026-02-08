import React from 'react';
import { View } from 'react-native';

import EditStoreMain from '../components/edit-store/EditStoreMain';
import useGoBack from '../hooks/useGoBack';
import { useCurrentStoreQuery } from '../data/queries';

const EditStore: React.FC = () => {
	const { isFetching, data } = useCurrentStoreQuery();
	useGoBack();

	if (isFetching || !data?.store) {
		return <View />;
	}

	return <EditStoreMain store={data.store} />;
};

export default EditStore;
