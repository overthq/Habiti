import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Icon, Typography, useTheme } from '@habiti/components';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { getHeaderTitle } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomHeader = ({
	navigation,
	route,
	options
}: NativeStackHeaderProps) => {
	const { top } = useSafeAreaInsets();
	const { theme } = useTheme();

	const title = getHeaderTitle(options, route.name);

	return (
		<View
			style={{
				paddingTop: top + 16,
				paddingBottom: 16,
				paddingHorizontal: 16,
				flexDirection: 'row',
				borderColor: theme.border.color,
				borderBottomWidth: StyleSheet.hairlineWidth,
				gap: 12,
				alignItems: 'center',
				justifyContent: 'space-between'
			}}
		>
			<View style={{ minWidth: 24, height: 24, zIndex: 1 }}>
				{navigation.canGoBack() && (
					<Pressable onPress={navigation.goBack} hitSlop={12}>
						<Icon name='chevron-left' style={{ marginLeft: -4 }} />
					</Pressable>
				)}
			</View>

			<View
				pointerEvents='none'
				style={{
					...StyleSheet.absoluteFill,
					paddingTop: top + 16,
					paddingBottom: 16,
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<Typography size='large' weight='medium' numberOfLines={1}>
					{title}
				</Typography>
			</View>

			<View style={{ minHeight: 24, alignItems: 'flex-end', zIndex: 1 }}>
				{options.headerRight ? <options.headerRight /> : null}
			</View>
		</View>
	);
};

export default CustomHeader;
