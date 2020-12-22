import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon, IconType } from '../icons';
import { openLink } from '../../utils/links';

interface SocialLinksProps {
	links: {
		iconName: IconType;
		url: string;
	}[];
}

const SocialLinks: React.FC<SocialLinksProps> = ({ links }) => (
	<View style={{ flexDirection: 'row' }}>
		{links.map(({ iconName, url }) => (
			<TouchableOpacity
				key={iconName}
				style={{ marginRight: 20 }}
				activeOpacity={0.8}
				onPress={() => openLink(url)}
			>
				<Icon name={iconName} />
			</TouchableOpacity>
		))}
	</View>
);

export default SocialLinks;
