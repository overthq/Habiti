import React from 'react';
import { RefreshControl, RefreshControlProps } from 'react-native';
import { useTheme } from '@habiti/components';

interface RefresherProps extends Omit<
	RefreshControlProps,
	'refreshing' | 'onRefresh'
> {
	refreshing: boolean;
	onRefresh: () => void;
}

// Thin wrapper around RefreshControl. IMPORTANT: on Android, ScrollView clones
// the element passed to its `refreshControl` prop and injects the scroll content
// as `children` (plus a `style`) — see RN's ScrollView.render. We must forward
// those injected props to the underlying RefreshControl, otherwise the entire
// scroll content is dropped and the screen renders empty on Android.
const Refresher = React.memo(
	({ refreshing, onRefresh, ...rest }: RefresherProps) => {
		const { theme } = useTheme();

		return (
			<RefreshControl
				refreshing={refreshing}
				onRefresh={onRefresh}
				tintColor={theme.text.secondary}
				{...rest}
			/>
		);
	}
);

Refresher.displayName = 'Refresher';

export default Refresher;
