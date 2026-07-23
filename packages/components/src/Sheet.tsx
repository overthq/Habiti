import React from 'react';
import {
	FlatList,
	FlatListProps,
	Platform,
	ScrollView,
	ScrollViewProps,
	TextInput,
	TextInputProps,
	View,
	ViewProps
} from 'react-native';
import {
	BottomSheetFlatList,
	BottomSheetScrollView,
	BottomSheetTextInput,
	BottomSheetView
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ViewComponent = (
	Platform.OS === 'ios' ? View : BottomSheetView
) as React.ComponentType<ViewProps>;

export const SheetView: React.FC<ViewProps> = ({ style, ...props }) => {
	const { bottom } = useSafeAreaInsets();
	const bottomInset = Platform.OS === 'ios' ? 0 : bottom;

	return (
		<ViewComponent style={[{ paddingBottom: bottomInset }, style]} {...props} />
	);
};

const ScrollViewComponent = (
	Platform.OS === 'ios' ? ScrollView : BottomSheetScrollView
) as React.ComponentType<ScrollViewProps>;

export const SheetScrollView: React.FC<ScrollViewProps> = props => (
	<ScrollViewComponent {...props} />
);

export function SheetFlatList<T>(props: FlatListProps<T>) {
	const Component = (
		Platform.OS === 'ios' ? FlatList : BottomSheetFlatList
	) as React.ComponentType<FlatListProps<T>>;

	return <Component {...props} />;
}

const TextInputComponent = (Platform.OS === 'ios'
	? TextInput
	: BottomSheetTextInput) as unknown as React.ForwardRefExoticComponent<
	TextInputProps & React.RefAttributes<TextInput>
>;

export const SheetTextInput = React.forwardRef<TextInput, TextInputProps>(
	(props, ref) => <TextInputComponent ref={ref} {...props} />
);

SheetTextInput.displayName = 'SheetTextInput';
