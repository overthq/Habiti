import React from 'react';
import { View, Image, Text, Pressable, StyleSheet } from 'react-native';
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
			<View style={styles.main}>
				<View style={styles.placeholder}>
					<Image source={{ uri: store.image?.path }} style={styles.image} />
				</View>
				<View style={{ marginLeft: 16, flex: 1 }}>
					<Text style={styles.name}>{store.name}</Text>
					{store.website && (
						<Pressable
							style={styles.website}
							onPress={() => openLink(store?.website)}
						>
							<Text style={styles.websiteLinkText}>{store.website}</Text>
						</Pressable>
					)}
					<View style={{ marginTop: 4, flexDirection: 'row' }}>
						<SocialLinks
							links={[
								{ type: 'twitter', value: store.twitter },
								{ type: 'instagram', value: store.instagram }
							]}
						/>
						<FollowButton storeId={store.id} followed={store.followedByUser} />
					</View>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 8,
		paddingTop: 16,
		paddingBottom: 8
	},
	main: {
		flexDirection: 'row',
		marginBottom: 8
	},
	placeholder: {
		backgroundColor: '#D3D3D3',
		width: 80,
		height: 80,
		borderRadius: 40,
		overflow: 'hidden'
	},
	image: {
		width: '100%',
		height: '100%'
	},
	actions: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	name: {
		fontSize: 20,
		fontWeight: '500'
	},
	description: {
		fontSize: 14,
		marginBottom: 4
	},
	website: {
		marginTop: 2
	},
	websiteLinkText: {
		fontSize: 16,
		color: '#455e96'
	}
});

export default StoreHeader;
