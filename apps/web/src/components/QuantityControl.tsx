import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantityControlProps {
	quantity: number;
	setQuantity: (quantity: number) => void;
	allowDelete?: boolean;
	showLabel?: boolean;
	className?: string;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
	quantity,
	setQuantity,
	allowDelete = false,
	showLabel = true,
	className
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
		<div className={cn(showLabel && 'my-4 space-y-2', className)}>
			{showLabel && <p className='font-medium'>Quantity</p>}

			<div className='flex items-center border rounded-full w-min py-2 px-3'>
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
				<p className='text-sm tabular-nums w-[5ch] text-center'>{quantity}</p>
				<button onClick={increment} className='bg-transparent'>
					<Plus className='size-4' />
				</button>
			</div>
		</div>
	);
};

export default QuantityControl;
