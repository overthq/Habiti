import { CustomImage, Typography } from '@market/components';
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import FollowButton from './FollowButton';
import SocialLinks from './SocialLinks';
import { StoreQuery } from '../../types/api';
import { openLink } from '../../utils/links';

interface StoreHeaderProps {
	store: StoreQuery['store'];
}

const StoreHeader: React.FC<StoreHeaderProps> = ({ store }) => {
	return (
		<View style={styles.container}>
			<View style={styles.main}>
				<CustomImage
					uri={store.image?.path}
					height={80}
					width={80}
					style={styles.image}
				/>
				<View style={{ marginLeft: 16, flex: 1 }}>
					<Typography size='xlarge' weight='medium'>
						{store.name}
					</Typography>
					{store.website && (
						<Pressable
							style={styles.website}
							onPress={() => openLink(store?.website)}
						>
							<Typography style={styles.websiteLinkText}>
								{store.website}
							</Typography>
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
	image: {
		borderRadius: 40
	},
	actions: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	website: {
		marginTop: 2
	},
	websiteLinkText: {
		color: '#455e96'
	}
});

export default StoreHeader;
