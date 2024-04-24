import React from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';

import Input from './Input';
import type { InputProps } from './Input';

interface FormInputProps<T extends FieldValues> extends InputProps {
	name: Path<T>;
	control: Control<T>;
}

const FormInput = <T extends FieldValues>({
	name,
	control,
	...props
}: FormInputProps<T>) => {
	const { field } = useController({ control, name });

	return (
		<Input
			value={field.value}
			onChangeText={field.onChange}
			onBlur={field.onBlur}
			{...props}
		/>
	);
};

export default FormInput;
