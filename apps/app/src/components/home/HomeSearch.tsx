import { Screen, useTheme } from '@habiti/components';
import SearchResults from '../explore/SearchResults';
import Animated, { LinearTransition } from 'react-native-reanimated';

interface HomeSearchProps {
	searchTerm: string;
	searchOpen: boolean;
}

const HomeSearch = ({ searchTerm, searchOpen }: HomeSearchProps) => {
	const { theme } = useTheme();
	return (
		<Animated.View
			style={{
				flex: 1,
				backgroundColor: theme.screen.background,
				display: searchOpen ? 'flex' : 'none'
			}}
			layout={LinearTransition}
		>
			<SearchResults searchTerm={searchTerm} />
		</Animated.View>
	);
};

export default HomeSearch;
