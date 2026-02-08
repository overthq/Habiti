import {
	EmptyState,
	Icon,
	Row,
	Screen,
	ScrollableScreen,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Pressable, RefreshControl } from 'react-native';

import FAB from '../components/products/FAB';
import useGoBack from '../hooks/useGoBack';
import { useCategoriesQuery } from '../data/queries';
import { AppStackParamList } from '../types/navigation';
import { StoreProductCategory } from '../data/types';

interface CategoriesListItemProps {
	category: StoreProductCategory;
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
	const { data, isLoading, refetch } = useCategoriesQuery();
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();
	const { theme } = useTheme();
	const [refreshing, setRefreshing] = React.useState(false);

	const handleRefresh = React.useCallback(() => {
		setRefreshing(true);
		refetch();
	}, [refetch]);

	React.useEffect(() => {
		if (!isLoading && refreshing) {
			setRefreshing(false);
		}
	}, [isLoading, refreshing]);

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

	const handleCategoryPress = (category: StoreProductCategory) => () => {
		navigate('Modals.EditCategory', {
			categoryId: category.id,
			name: category.name,
			description: category.description
		});
	};

	if (isLoading) {
		return <View />;
	}

	if (data?.categories.length === 0) {
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
				<Spacer y={16} />
				{data?.categories.map(category => (
					<CategoriesListItem
						key={category.id}
						category={category}
						onPress={handleCategoryPress(category)}
					/>
				))}
			</ScrollableScreen>
			<FAB onPress={handleAddCategory} text='Add Category' />
		</Screen>
	);
};

export default Categories;
