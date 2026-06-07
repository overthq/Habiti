import React from 'react';
import { RefreshControl } from 'react-native';
import { useTheme } from '@habiti/components';

interface RefresherProps {
	refreshing: boolean;
	onRefresh: () => void;
}

// Module-scope memoized RefreshControl. Rendered as `<Refresher />` inside the
// main return (after any early returns) so the element isn't constructed on the
// loading/bail-out path, while prop-equality memoization keeps it stable.
const Refresher = React.memo(({ refreshing, onRefresh }: RefresherProps) => {
	const { theme } = useTheme();

	return (
		<RefreshControl
			refreshing={refreshing}
			onRefresh={onRefresh}
			tintColor={theme.text.secondary}
		/>
	);
});

Refresher.displayName = 'Refresher';

export default Refresher;
