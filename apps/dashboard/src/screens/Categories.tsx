import {
	EmptyState,
	Icon,
	Row,
	Screen,
	ScrollableScreen,
	Typography,
	useTheme
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Pressable, RefreshControl } from 'react-native';

import FAB from '../components/products/FAB';
import useGoBack from '../hooks/useGoBack';
import { CategoriesQuery, useCategoriesQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

interface CategoriesListItemProps {
	category: CategoriesQuery['currentStore']['categories'][number];
	onPress: () => void;
}

const CategoriesListItem: React.FC<CategoriesListItemProps> = ({
	category,
	onPress
}) => {
	return (
		<Row onPress={onPress} style={{ paddingVertical: 8 }}>
			<Typography>{category.name}</Typography>
		</Row>
	);
};

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
		return <View />;
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
			<ScrollableScreen
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={handleRefresh}
						tintColor={theme.text.secondary}
					/>
				}
			>
				{data?.currentStore.categories.map(category => (
					<CategoriesListItem
						key={category.id}
						category={category}
						onPress={handleCategoryPress(category.id)}
					/>
				))}
			</ScrollableScreen>
			<FAB onPress={handleAddCategory} text='Add Category' />
		</Screen>
	);
};

export default Categories;
