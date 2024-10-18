import {
	EmptyState,
	Icon,
	ScrollableScreen,
	Typography,
	useTheme
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import {
	View,
	ActivityIndicator,
	Pressable,
	RefreshControl
} from 'react-native';

import useGoBack from '../hooks/useGoBack';
import { useCategoriesQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

const Categories = () => {
	const [{ data, fetching }, refetch] = useCategoriesQuery();
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();
	const { theme } = useTheme();
	const [refreshing, setRefreshing] = React.useState(false);

	const handleRefresh = React.useCallback(() => {
		setRefreshing(true);
		refetch();
	}, [refetch]);

	React.useEffect(() => {
		if (!fetching && refreshing) {
			setRefreshing(false);
		}
	}, [fetching, refreshing]);

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

	const handleCategoryPress = (categoryId: string) => () => {
		navigate('Modals.EditCategory', { categoryId });
	};

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
		<ScrollableScreen
			style={{ padding: 16 }}
			refreshControl={
				<RefreshControl
					refreshing={fetching}
					onRefresh={handleRefresh}
					tintColor={theme.text.secondary}
				/>
			}
		>
			{data?.currentStore.categories.map(category => (
				<Pressable
					key={category.id}
					onPress={handleCategoryPress(category.id)}
					style={{ marginBottom: 8 }}
				>
					<Typography>{category.name}</Typography>
				</Pressable>
			))}
		</ScrollableScreen>
	);
};

export default Categories;
