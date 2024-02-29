import { Icon } from '@market/components';
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import { LinkType, openLink, getLink } from '../../utils/links';

interface SocialLinksProps {
	links: {
		type: LinkType;
		value?: string | null;
	}[];
}

const SocialLinks: React.FC<SocialLinksProps> = ({ links }) => (
	<View style={styles.container}>
		{links.map(
			({ type, value }) =>
				value && (
					<TouchableOpacity
						key={type}
						style={{ marginRight: 8 }}
						activeOpacity={0.8}
						onPress={() => openLink(getLink(type, value))}
					>
						<Icon name={type} size={20} />
					</TouchableOpacity>
				)
		)}
	</View>
);

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center'
	}
});

export default SocialLinks;
