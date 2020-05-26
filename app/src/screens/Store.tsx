import React from 'react';
import {
	View,
	Text,
	FlatList,
	ActivityIndicator,
	StyleSheet,
	TouchableOpacity,
	Linking
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStoreQuery, useStoreItemsQuery } from '../types';
import { Icon } from '../components/icons';
import { CartsContext } from '../contexts/CartsContext';

const StoreItems: React.FC<{ storeId: string; header: React.ReactNode }> = ({
	storeId,
	header
}) => {
	const [{ data, fetching }] = useStoreItemsQuery({ variables: { storeId } });
	const { addItemToCart } = React.useContext(CartsContext);

	if (fetching) {
		return <ActivityIndicator />;
	}

	return (
		<FlatList
			data={data?.storeItems}
			keyExtractor={({ id }) => id}
			ListHeaderComponent={
				<>
					{header}
					<View style={{ marginBottom: 20 }} />
				</>
			}
			renderItem={({ item, index }) => {
				return (
					<View style={{ flex: 1, flexDirection: 'column' }}>
						<TouchableOpacity
							key={item.id}
							style={{
								flex: 1,
								margin: 10
								// ...(index % 2 === 0
								// 	? { paddingLeft: 20, paddingRight: 10 }
								// 	: { paddingRight: 20, paddingLeft: 10 })
							}}
							onPress={() =>
								addItemToCart({ storeId, itemId: item.id, quantity: 5 })
							}
							activeOpacity={0.8}
						>
							<View style={styles.itemImage} />
							<Text style={styles.itemName}>{item.name}</Text>
							<Text style={{ color: '#505050', fontSize: 15 }}>
								${item.price_per_unit}
							</Text>
						</TouchableOpacity>
					</View>
				);
			}}
			numColumns={2}
		/>
	);
};

const Store = () => {
	const { setOptions } = useNavigation();
	const { params } = useRoute();
	const [{ data }] = useStoreQuery({
		variables: { storeId: params?.storeId }
	});

	React.useLayoutEffect(() => {
		setOptions({ title: data?.store.name });
	}, [data]);

	const handleLinkOpen = async (link?: string | null) => {
		if (link) {
			const supported = await Linking.canOpenURL(link);
			if (supported) {
				await Linking.openURL(link);
			}
		}
	};

	return (
		<View style={styles.container}>
			<StoreItems
				storeId={data?.store.id}
				header={
					<View
						style={{
							paddingTop: 25,
							paddingHorizontal: 10
						}}
					>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center'
							}}
						>
							<View
								style={{
									backgroundColor: '#D3D3D3',
									width: 100,
									height: 100,
									borderRadius: 50
								}}
							/>
							<View>
								{data?.store.profile.twitter_username && (
									<TouchableOpacity
										onPress={() =>
											handleLinkOpen(
												`https://twitter.com/${data.store.profile.twitter_username}`
											)
										}
									>
										<Icon name='twitter' />
									</TouchableOpacity>
								)}
								{data?.store.profile.instagram_username && (
									<TouchableOpacity
										onPress={() =>
											handleLinkOpen(
												`https://instagram.com/${data.store.profile.instagram_username}`
											)
										}
									>
										<Icon name='instagram' />
									</TouchableOpacity>
								)}
							</View>
						</View>
						<View>
							<Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>
								{data?.store.name}
							</Text>
							{data?.store.profile.website_url && (
								<TouchableOpacity
									style={{ marginTop: 5 }}
									onPress={() => handleLinkOpen(data.store.profile.website_url)}
								>
									<Text style={{ fontSize: 16, color: '#202020' }}>
										{data.store.profile.website_url}
									</Text>
								</TouchableOpacity>
							)}
						</View>
						<TouchableOpacity
							style={{
								marginTop: 10,
								width: '100%',
								height: 35,
								borderWidth: 1,
								borderColor: '#D3D3D3',
								borderRadius: 4,
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<View style={{ marginRight: 5 }}>
								<Icon size={20} name='plus' />
							</View>
							<Text style={{ fontSize: 16, fontWeight: '500' }}>Follow</Text>
						</TouchableOpacity>
					</View>
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 10
	},
	itemImage: {
		backgroundColor: '#D3D3D3',
		borderRadius: 8,
		marginBottom: 10,
		width: '100%',
		height: 250
	},
	itemName: {
		fontSize: 16,
		fontWeight: '500'
	}
});

export default Store;
