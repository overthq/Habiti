import { Icon } from '@market/components';
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

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
					<Pressable
						key={type}
						style={{ marginRight: 8 }}
						onPress={() => openLink(getLink(type, value))}
					>
						<Icon name={type} size={20} />
					</Pressable>
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
