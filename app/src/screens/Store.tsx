import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStoreQuery } from '../types';

const Store = () => {
	const { setOptions } = useNavigation();
	const { params } = useRoute();
	const [{ data }] = useStoreQuery({
		variables: { storeId: params?.storeId as string }
	});

	React.useLayoutEffect(() => {
		setOptions({ title: data?.store.name });
	}, [data]);

	return (
		<SafeAreaView>
			<View />
		</SafeAreaView>
	);
};

export default Store;
