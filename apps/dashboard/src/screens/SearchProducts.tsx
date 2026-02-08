import {
	Icon,
	Screen,
	SearchInput,
	TextButton,
	useTheme
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React from 'react';
import {
	ActivityIndicator,
	Pressable,
	TextInput,
	View,
	StyleSheet
} from 'react-native';
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ProductsListItem from '../components/products/ProductsListItem';
import { ProductsStackParamList } from '../types/navigation';
import { useProductsQuery } from '../data/queries';
import { Product } from '../data/types';

interface SearchProductsHeaderProps {
	searchTerm: string;
	setSearchTerm(value: string): void;
}

const SearchProductsHeader: React.FC<SearchProductsHeaderProps> = ({
	searchTerm,
	setSearchTerm
}) => {
	const { top } = useSafeAreaInsets();
	const { goBack } = useNavigation();
	const inputRef = React.useRef<TextInput>(null);
	const [focused, setFocused] = React.useState(false);
	const { theme } = useTheme();

	const blurInput = React.useCallback(() => {
		inputRef.current?.blur();
	}, [inputRef.current]);

	return (
		<View
			style={[
				styles.container,
				{ paddingTop: top + 8, borderBottomColor: theme.border.color }
			]}
		>
			<Pressable onPress={goBack} style={{ marginLeft: 8 }}>
				<Icon name='chevron-left' size={28} />
			</Pressable>
			<SearchInput
				inputRef={inputRef}
				setFocused={setFocused}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
			/>
			{focused ? (
				<Animated.View
					layout={LinearTransition}
					entering={FadeIn}
					exiting={FadeOut}
					style={{ paddingLeft: 12 }}
				>
					<TextButton onPress={blurInput}>Cancel</TextButton>
				</Animated.View>
			) : null}
		</View>
	);
};

const SearchProducts = () => {
	const [term, setTerm] = React.useState('');
	const { navigate } = useNavigation<NavigationProp<ProductsStackParamList>>();
	const { data, isLoading } = useProductsQuery({ search: term });

	const handlePress = React.useCallback(
		(productId: string) => () =>
			navigate('Product', { screen: 'Product.Main', params: { productId } }),
		[]
	);

	const renderProduct: ListRenderItem<Product> = React.useCallback(
		({ item }) => {
			return <ProductsListItem product={item} onPress={handlePress(item.id)} />;
		},
		[]
	);

	return (
		<Screen>
			<SearchProductsHeader searchTerm={term} setSearchTerm={setTerm} />
			{isLoading || !data ? (
				<ActivityIndicator />
			) : (
				<FlashList
					data={data.products}
					keyExtractor={p => p.id}
					showsVerticalScrollIndicator={false}
					renderItem={renderProduct}
					estimatedItemSize={60}
				/>
			)}
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		borderBottomWidth: 0.5,
		paddingRight: 16,
		alignItems: 'center',
		paddingBottom: 12
	}
});

export default SearchProducts;
