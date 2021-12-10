import React from 'react';
import { FlatList, StyleSheet, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
	useSharedValue,
	useAnimatedScrollHandler
} from 'react-native-reanimated';
import { useCreateStoreMutation } from '../types/api';
import Button from '../components/global/Button';
// import { useAppSelector } from '../redux/store';
import { updatePreference } from '../redux/preferences/actions';
import Brand from '../components/create-store/Brand';
import Social from '../components/create-store/Social';
import StoreImage from '../components/create-store/StoreImage';
import { uploadImage } from '../utils/images';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const { width } = Dimensions.get('window');

const steps = [
	{ title: 'Brand', component: <Brand /> },
	{ title: 'Social', component: <Social /> },
	{ title: 'Store Image', component: <StoreImage /> }
];

const CreateStore: React.FC = () => {
	const [, createStore] = useCreateStoreMutation();
	// const userId = useAppSelector(({ auth }) => auth.userId);
	const [activeStepIndex, setActiveStepIndex] = React.useState(0);
	const listRef = React.useRef<FlatList>(null);
	const dispatch = useDispatch();
	const scrollX = useSharedValue(0);

	const toNext = () => {
		listRef.current?.scrollToIndex({
			animated: true,
			index: activeStepIndex + 1
		});
	};

	const handleViewableItemsChanged = React.useCallback(({ viewableItems }) => {
		viewableItems[0] && setActiveStepIndex(viewableItems[0].index);
	}, []);

	const handleScroll = useAnimatedScrollHandler({
		onScroll: ({ contentOffset: { x } }) => {
			scrollX.value = x;
		}
	});

	const isLastStep = activeStepIndex === steps.length - 1;

	return (
		<SafeAreaView style={styles.container}>
			<Formik
				initialValues={{
					name: '',
					shortName: '',
					twitter: '',
					instagram: '',
					website: '',
					storeImage: ''
				}}
				onSubmit={async values => {
					try {
						const { data } = await createStore({
							input: { name: values.name }
						});

						if (data?.createStore?.id) {
							if (values.storeImage) {
								await uploadImage(values.storeImage, {
									storeId: data.createStore.id
								});
							}

							dispatch(updatePreference({ activeStore: data.createStore.id }));
						}
					} catch (error) {
						console.log(error);
					}
				}}
			>
				{({ handleSubmit }) => (
					<>
						<AnimatedFlatList
							ref={listRef}
							horizontal
							decelerationRate='fast'
							snapToInterval={width}
							showsHorizontalScrollIndicator={false}
							data={steps}
							keyExtractor={s => s.title}
							renderItem={({ item }) => item.component}
							onViewableItemsChanged={handleViewableItemsChanged}
							onScroll={handleScroll}
						/>
						<Button
							text={isLastStep ? 'Submit' : 'Next'}
							onPress={isLastStep ? handleSubmit : toNext}
							style={{ alignSelf: 'center', width: width - 32 }}
						/>
					</>
				)}
			</Formik>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	title: {
		fontSize: 36,
		fontWeight: 'bold',
		marginBottom: 16
	},
	description: {
		fontSize: 16
	},
	input: {
		fontSize: 16,
		borderRadius: 4,
		borderWidth: 2,
		borderColor: '#D3D3D3',
		paddingLeft: 8,
		height: 40
	},
	formStep: {
		width,
		paddingHorizontal: 16
	}
});

export default CreateStore;
