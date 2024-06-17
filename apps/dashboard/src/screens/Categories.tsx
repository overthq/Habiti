import { EmptyState, Icon, Screen, Typography } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, ActivityIndicator, Pressable } from 'react-native';

import useGoBack from '../hooks/useGoBack';
import { useCategoriesQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

const Categories = () => {
	const [{ data, fetching }] = useCategoriesQuery();
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();

	useGoBack();

	const handleAddCategory = React.useCallback(() => {
		navigate('AddCategory');
	}, []);

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<Pressable onPress={handleAddCategory}>
					<Icon name='plus' />
				</Pressable>
			)
		});
	}, []);

	if (fetching) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	if (data?.currentStore.categories.length === 0) {
		return (
			<EmptyState
				title='No categories found'
				description='You do not currently have any categories set up.'
				cta={{ text: 'Add category', action: handleAddCategory }}
			/>
		);
	}

	return (
		<Screen style={{ padding: 16 }}>
			{data?.currentStore.categories.map(category => (
				<Typography key={category.id}>{category.name}</Typography>
			))}
		</Screen>
	);
};

export default Categories;
