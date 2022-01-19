import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { openLink } from '../../utils/links';
import { StoreQuery } from '../../types/api';
import FollowButton from './FollowButton';
import SocialLinks from './SocialLinks';

interface StoreHeaderProps {
	store: StoreQuery['store'];
}

const StoreHeader: React.FC<StoreHeaderProps> = ({ store }) => {
	return (
		<View style={styles.container}>
			<View style={styles.row}>
				<View style={styles.placeholder}>
					{store.image && (
						<Image source={{ uri: store.image.path }} style={styles.image} />
					)}
				</View>
				<View style={styles.actions}>
					<SocialLinks
						links={[
							{ type: 'twitter', value: store?.twitter },
							{ type: 'instagram', value: store?.instagram }
						]}
					/>
					<FollowButton store={store} />
				</View>
			</View>
			<View>
				<Text style={styles.name}>{store.name}</Text>
				<TouchableOpacity
					style={styles.website}
					onPress={() => openLink(store?.website)}
				>
					<Text style={styles.websiteLinkText}>{store?.website}</Text>
				</TouchableOpacity>
				{store?.description && (
					<Text style={styles.description}>{store.description}</Text>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 8,
		paddingBottom: 8
	},
	bar: {
		width: '100%',
		flexDirection: 'row',
		marginVertical: 8,
		marginHorizontal: -8
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: 16
	},
	placeholder: {
		backgroundColor: '#D3D3D3',
		width: 100,
		height: 100,
		borderRadius: 50,
		overflow: 'hidden'
	},
	image: {
		width: '100%',
		height: '100%'
	},
	actions: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 16
	},
	name: {
		fontSize: 24,
		fontWeight: 'bold',
		marginTop: 8,
		marginBottom: 4
	},
	description: {
		fontSize: 16,
		marginBottom: 4
	},
	website: {
		marginBottom: 4
	},
	websiteLinkText: {
		fontSize: 16,
		color: '#455e96'
	}
});

export default StoreHeader;
