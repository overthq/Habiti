import React from 'react';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import { useCategoriesQuery } from '../types/api';
import useGoBack from '../hooks/useGoBack';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Icon } from '../components/Icon';
import { AppStackParamList } from '../types/navigation';
import Screen from '../components/global/Screen';

const Categories = () => {
	const [{ data, fetching }] = useCategoriesQuery();
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();

	useGoBack();

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
					<Pressable onPress={() => navigate('AddCategory')}>
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

	if (!data?.currentStore.categories) {
		return (
			<View>
				<Text>No categories</Text>
			</View>
		);
	}

	return (
		<Screen>
			{data.currentStore.categories.map(category => (
				<Text key={category.id}>{category.name}</Text>
			))}
		</Screen>
	);
};

export default Categories;
