import React from 'react';
import {
	ActivityIndicator,
	Alert,
	Linking,
	Share,
	StyleSheet,
	View
} from 'react-native';
import {
	Avatar,
	Icon,
	IconType,
	Row,
	ScrollableScreen,
	SectionHeader,
	Separator,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { useStoreQuery } from '../data/queries';
import { AppStackParamList } from '../navigation/types';
import { getFrontendUrl } from '../utils/links';

const StoreInfo = () => {
	const { params } =
		useRoute<RouteProp<AppStackParamList, 'Modal.StoreInfo'>>();
	const { goBack } = useNavigation();
	const { data, isLoading } = useStoreQuery(params.storeId);
	const { theme } = useTheme();

	if (isLoading || !data?.store) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator />
			</View>
		);
	}

	const { store } = data;
	const webUrl = getFrontendUrl(`/store/${store.id}`);

	const handleViewOnWeb = () => {
		Linking.openURL(webUrl);
	};

	const handleShare = () => {
		Share.share({
			message: `Check out ${store.name} on Habiti: ${webUrl}`,
			url: webUrl
		});
	};

	const handleReport = () => {
		Alert.alert(
			'Report store',
			`Report ${store.name} for inappropriate or harmful content?`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Report',
					style: 'destructive',
					onPress: () => {
						Alert.alert(
							'Report submitted',
							'Thanks for letting us know. Our team will review this store.',
							[{ text: 'OK', onPress: goBack }]
						);
					}
				}
			]
		);
	};

	return (
		<ScrollableScreen>
			<View style={styles.header}>
				<Avatar size={72} uri={store.image?.path} fallbackText={store.name} />
				<Spacer y={12} />
				<Typography size='xlarge' weight='medium'>
					{store.name}
				</Typography>
				{store.unlisted && (
					<>
						<Spacer y={4} />
						<View
							style={[
								styles.unlistedBadge,
								{ backgroundColor: theme.input.background }
							]}
						>
							<Typography size='xsmall' variant='secondary'>
								Unlisted
							</Typography>
						</View>
					</>
				)}
			</View>

			<Spacer y={24} />

			{store.description ? (
				<>
					<SectionHeader title='About' padded={false} />
					<Spacer y={4} />
					<Typography variant='secondary'>{store.description}</Typography>
					<Spacer y={24} />
				</>
			) : null}

			<SectionHeader title='Reviews' padded={false} />
			<Spacer y={4} />
			<Typography variant='secondary'>No reviews yet.</Typography>

			<Spacer y={24} />

			<View style={{ marginHorizontal: -16 }}>
				<InfoRow
					title='View on the web'
					icon='arrow-up-right'
					onPress={handleViewOnWeb}
				/>
				<Separator inset />
				<InfoRow title='Share store' onPress={handleShare} />
				<Separator inset />
				<InfoRow title='Report store' onPress={handleReport} destructive />
			</View>
		</ScrollableScreen>
	);
};

interface InfoRowProps {
	title: string;
	icon?: IconType;
	onPress(): void;
	destructive?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({
	title,
	icon = 'chevron-right',
	onPress,
	destructive = false
}) => {
	const { theme } = useTheme();

	return (
		<Row style={styles.row} onPress={onPress}>
			<Typography variant={destructive ? 'error' : 'primary'}>
				{title}
			</Typography>
			<Icon
				name={icon}
				size={20}
				color={destructive ? theme.text.error : theme.text.secondary}
			/>
		</Row>
	);
};

const styles = StyleSheet.create({
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	header: {
		alignItems: 'center'
	},
	unlistedBadge: {
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 4
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12
	}
});

export default StoreInfo;
