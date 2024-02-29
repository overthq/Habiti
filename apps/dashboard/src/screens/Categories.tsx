import React from 'react';
import { View, ActivityIndicator, Pressable } from 'react-native';
import { useCategoriesQuery } from '../types/api';
import useGoBack from '../hooks/useGoBack';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Icon } from '../components/Icon';
import { AppStackParamList } from '../types/navigation';
import Screen from '../components/global/Screen';
import Typography from '../components/global/Typography';
import EmptyState from '../components/global/EmptyState';

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
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginRight: 16
					}}
				>
					<Pressable onPress={handleAddCategory}>
						<Icon name='plus' />
					</Pressable>
				</View>
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
		<Screen>
			{data?.currentStore.categories.map(category => (
				<Typography key={category.id}>{category.name}</Typography>
			))}
		</Screen>
	);
};

export default Categories;
