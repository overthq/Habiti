import { Minus, Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface QuantityControlProps {
	value: number;
	onValueChange: React.Dispatch<React.SetStateAction<number>>;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
	value,
	onValueChange
}) => {
	return (
		<div className='flex justify-between items-center mb-4'>
			<p className='font-medium'>Quantity</p>
			<div className='flex items-center p-1 gap-4 border rounded-md'>
				<Button
					variant='ghost'
					size='sm'
					onClick={() => onValueChange(v => Math.max(0, v - 1))}
				>
					<Minus className='size-4' />
				</Button>
				<p className='tabular-nums'>{value}</p>
				<Button
					variant='ghost'
					size='sm'
					onClick={() => onValueChange(v => v + 1)}
				>
					<Plus className='size-4' />
				</Button>
			</div>
		</div>
	);
};

export default QuantityControl;
