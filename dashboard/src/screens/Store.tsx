import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../components/icons';
import { useAppSelector } from '../redux/store';
import { useStoreQuery } from '../types/api';

const Store: React.FC = () => {
	const activeStore = useAppSelector(
		({ preferences }) => preferences.activeStore
	);
	const [{ data }] = useStoreQuery({
		variables: { storeId: activeStore as string }
	});

	const store = data?.store;

	return (
		<SafeAreaView style={styles.container}>
			<TouchableOpacity style={styles.storeSettingRow}>
				<View style={styles.rowMainContainer}>
					<View style={styles.storeAvatar}>
						<Text style={styles.storeAvatarText}>{store?.name[0]}</Text>
					</View>
					<View style={styles.storeMeta}>
						<Text style={styles.storeName}>{store?.name}</Text>
						{/* <Text>@{store?.short_name}</Text> */}
					</View>
				</View>
				<Icon name='chevronRight' size={16} color='#D3D3D3' />
			</TouchableOpacity>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	storeSettingRow: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 8
	},
	rowMainContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	storeAvatar: {
		height: 40,
		width: 40,
		borderRadius: 30,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#505050'
	},
	storeAvatarText: {
		fontSize: 22,
		fontWeight: '500',
		color: '#D3D3D3'
	},
	storeMeta: {
		marginLeft: 8
	},
	storeName: {
		fontSize: 17,
		fontWeight: '500'
	}
});

export default Store;
