import React from 'react';
import { Platform, View, StyleSheet, type ViewProps } from 'react-native';
import {
	KeyboardAwareScrollView,
	type KeyboardAwareScrollViewProps
} from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-screens/experimental';

import FormToolbar, { KEYBOARD_TOOLBAR_HEIGHT } from './FormToolbar';
import { useTheme } from './Theme';

export const Screen: React.FC<ViewProps> = props => {
	const { theme } = useTheme();

	return (
		<View
			{...props}
			style={[
				{ backgroundColor: theme.screen.background },
				styles.container,
				props.style
			]}
		/>
	);
};

interface TabBarSpacerProps {
	onHeightChange?(height: number): void;
}

export const TabBarSpacer: React.FC<TabBarSpacerProps> = ({
	onHeightChange
}) => {
	if (Platform.OS !== 'ios') return null;

	return (
		<View onLayout={e => onHeightChange?.(e.nativeEvent.layout.height)}>
			<SafeAreaView edges={{ bottom: true }} style={{ flex: 0 }} />
		</View>
	);
};

interface ScrollableScreenProps extends KeyboardAwareScrollViewProps {
	withToolbar?: boolean;
	avoidTabBar?: boolean;
	nativeInsets?: boolean;
}

export const ScrollableScreen: React.FC<ScrollableScreenProps> = ({
	bottomOffset = 16,
	extraKeyboardSpace = 0,
	withToolbar = false,
	avoidTabBar = false,
	nativeInsets = false,
	children,
	onLayout,
	...props
}) => {
	const { theme } = useTheme();
	const [tabBarHeight, setTabBarHeight] = React.useState(0);
	const [frameHeight, setFrameHeight] = React.useState(0);
	const [insetsHeight, setInsetsHeight] = React.useState(0);
	const fitInsets = nativeInsets && Platform.OS === 'ios';
	const toolbarHeight = withToolbar ? KEYBOARD_TOOLBAR_HEIGHT : 0;

	return (
		<>
			<KeyboardAwareScrollView
				keyboardShouldPersistTaps='handled'
				keyboardDismissMode='interactive'
				bottomOffset={bottomOffset + toolbarHeight}
				extraKeyboardSpace={extraKeyboardSpace + toolbarHeight}
				disableScrollOnKeyboardHide
				{...(avoidTabBar && {
					automaticallyAdjustsScrollIndicatorInsets: false,
					scrollIndicatorInsets: { bottom: tabBarHeight }
				})}
				{...props}
				onLayout={e => {
					setFrameHeight(e.nativeEvent.layout.height);
					onLayout?.(e);
				}}
				contentContainerStyle={[
					styles.contentContainer,
					{ backgroundColor: theme.screen.background },
					withToolbar && styles.toolbarContentContainer,
					fitInsets && {
						flexGrow: 0,
						minHeight: Math.max(frameHeight - insetsHeight, 0)
					},
					props.contentContainerStyle
				]}
				style={[
					{ backgroundColor: theme.screen.background },
					styles.scrollContainer,
					props.style
				]}
			>
				{children}
				{avoidTabBar && <TabBarSpacer onHeightChange={setTabBarHeight} />}
			</KeyboardAwareScrollView>
			{fitInsets && (
				<View
					pointerEvents='none'
					style={styles.insetsProbe}
					onLayout={e => setInsetsHeight(e.nativeEvent.layout.height)}
				>
					<SafeAreaView
						edges={{ top: true, bottom: true }}
						style={{ flex: 0 }}
					/>
				</View>
			)}
			{withToolbar && <FormToolbar />}
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16
	},
	scrollContainer: {
		flex: 1
	},
	contentContainer: {
		flexGrow: 1,
		paddingHorizontal: 16
	},
	insetsProbe: {
		position: 'absolute'
	},
	toolbarContentContainer: {
		flexGrow: 0
	}
});
