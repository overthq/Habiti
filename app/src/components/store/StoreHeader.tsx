import React from 'react';
import {
	View,
	// Image,
	Text,
	TouchableOpacity,
	StyleSheet,
	Pressable
} from 'react-native';
import { openLink } from '../../utils/links';
import { StoreQuery } from '../../types/api';
import FollowButton from './FollowButton';
import SocialLinks from './SocialLinks';
import { Icon } from '../icons';
import { useNavigation } from '@react-navigation/native';

interface StoreHeaderProps {
	store: StoreQuery['store'];
}

const StoreHeader: React.FC<StoreHeaderProps> = ({ store }) => {
	const { goBack } = useNavigation();

	return (
		<View style={styles.container}>
			<View style={styles.bar}>
				<Pressable onPress={goBack}>
					<Icon name='chevronLeft' size={32} />
				</Pressable>
			</View>
			<View style={styles.row}>
				<View style={styles.imagePlaceholder}>
					{/* <Image source={{ uri: '' }} style={styles.image} /> */}
				</View>
				<View style={{ flex: 1, marginLeft: 32 }}>
					<View style={{ flexDirection: 'row' }}>
						<Text style={styles.name}>{store?.name}</Text>
						{store?.description && (
							<Text style={styles.description}>{store?.description}</Text>
						)}
						<SocialLinks
							links={[
								{ type: 'twitter', value: store?.twitter },
								{ type: 'instagram', value: store?.instagram }
							]}
						/>
					</View>
					<TouchableOpacity
						style={{ marginTop: 4 }}
						onPress={() => openLink(store?.website)}
					>
						<Text style={styles.websiteLinkText}>{store?.website}</Text>
					</TouchableOpacity>
					<FollowButton store={store} />
				</View>
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
		justifyContent: 'space-between'
	},
	imagePlaceholder: {
		backgroundColor: '#D3D3D3',
		width: 100,
		height: 100,
		borderRadius: 50,
		overflow: 'hidden',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	image: {
		width: '100%',
		height: '100%'
	},
	name: {
		fontSize: 24,
		fontWeight: 'bold'
	},
	description: {
		fontSize: 16
	},
	websiteLinkText: {
		fontSize: 16,
		color: '#202020'
	}
});

export default StoreHeader;
