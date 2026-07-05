import React from 'react';
import { View } from 'react-native';
import {
	EmptyState,
	Icon,
	Row,
	ScrollableScreen,
	Typography
} from '@habiti/components';
import { HeaderButton } from '@react-navigation/elements';

import FAB from '../components/products/FAB';
import Refresher from '../components/Refresher';

import useRefresh from '../hooks/useRefresh';
import { useCategoriesQuery } from '../data/queries';
import type { StoreStackScreenProps } from '../navigation/types';
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

const Categories: React.FC<StoreStackScreenProps<'Categories'>> = ({
	navigation
}) => {
	const { data, isLoading, refetch } = useCategoriesQuery();
	const { isRefreshing, onRefresh } = useRefresh({ refetch });

	const handleAddCategory = React.useCallback(() => {
		navigation.navigate('Modal.AddCategory');
	}, [navigation]);

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<HeaderButton onPress={handleAddCategory}>
					<Icon name='plus' />
				</HeaderButton>
			),
			unstable_headerRightItems: () => [
				{
					type: 'button',
					label: 'Add',
					icon: {
						type: 'sfSymbol',
						name: 'plus'
					},
					onPress: handleAddCategory
				}
			]
		});
	}, [navigation, handleAddCategory]);

	const handleCategoryPress = (category: StoreProductCategory) => () => {
		navigation.navigate('Modal.EditCategory', {
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
		<>
			<ScrollableScreen
				style={{ marginHorizontal: -16 }}
				refreshControl={
					<Refresher refreshing={isRefreshing} onRefresh={onRefresh} />
				}
			>
				{data?.categories.map(category => (
					<CategoriesListItem
						key={category.id}
						category={category}
						onPress={handleCategoryPress(category)}
					/>
				))}
			</ScrollableScreen>
			<FAB onPress={handleAddCategory} text='Add Category' />
		</>
	);
};

export default Categories;
