import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

export type StatusTone = 'green' | 'yellow' | 'red' | 'gray';

const toneStyles: Record<StatusTone, string> = {
	green: 'bg-green-500 dark:bg-green-400',
	yellow: 'bg-yellow-500 dark:bg-yellow-400',
	red: 'bg-red-500 dark:bg-red-400',
	gray: 'bg-gray-500 dark:bg-gray-400'
};

interface StatusPillProps {
	tone: StatusTone;
	label: string;
}

const StatusPill = ({ tone, label }: StatusPillProps) => {
	return (
		<Badge variant='outline'>
			<div className={cn('size-2 rounded-full', toneStyles[tone])} />
			{label}
		</Badge>
	);
};

export default StatusPill;
