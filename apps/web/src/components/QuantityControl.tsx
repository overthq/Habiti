import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface QuantityControlProps {
	quantity: number;
	setQuantity: (quantity: number) => void;
	allowDelete?: boolean;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
	quantity,
	setQuantity,
	allowDelete = false
}) => {
	const decrementDisabled = React.useMemo(
		() => !allowDelete && quantity === 1,
		[quantity, allowDelete]
	);

	const decrement = React.useCallback(
		() => setQuantity(quantity - 1),
		[setQuantity, quantity]
	);
	const increment = React.useCallback(
		() => setQuantity(quantity + 1),
		[setQuantity, quantity]
	);

	const showDeleteIcon = allowDelete && quantity === 1;

	return (
		<div className='flex items-center border rounded-full w-min p-2'>
			<button
				onClick={decrement}
				disabled={decrementDisabled}
				className='bg-transparent disabled:opacity-50'
			>
				{showDeleteIcon ? (
					<Trash2 className='size-4' />
				) : (
					<Minus className='size-4' />
				)}
			</button>
			<p className='text-sm w-[35px] text-center'>{quantity}</p>
			<button onClick={increment} className='bg-transparent'>
				<Plus className='size-4' />
			</button>
		</div>
	);
};

export default QuantityControl;
