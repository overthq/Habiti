import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon } from '../Icon';
import { LinkType, openLink, getLink } from '../../utils/links';

interface SocialLinksProps {
	links: {
		type: LinkType;
		value?: string | null;
	}[];
}

const SocialLinks: React.FC<SocialLinksProps> = ({ links }) => (
	<View style={{ flexDirection: 'row' }}>
		{links.map(
			({ type, value }) =>
				value && (
					<TouchableOpacity
						key={type}
						style={{ marginRight: 20 }}
						activeOpacity={0.8}
						onPress={() => openLink(getLink(type, value))}
					>
						<Icon name={type} />
					</TouchableOpacity>
				)
		)}
	</View>
);

export default SocialLinks;
