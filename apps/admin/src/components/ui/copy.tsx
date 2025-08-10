import * as React from 'react';
import { Check, Copy } from 'lucide-react';

import { Button } from './button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from './tooltip';

export interface CopyableTextProps {
	value: string;
	displayValue?: string;
	truncate?: boolean;
	prefixChars?: number; // number of chars to show at start when truncating
	suffixChars?: number; // number of chars to show at end when truncating
	className?: string;
}

export const CopyableText: React.FC<CopyableTextProps> = ({
	value,
	displayValue,
	truncate = true,
	prefixChars = 6,
	suffixChars = 4,
	className
}) => {
	const [copied, setCopied] = React.useState(false);

	const shownText = React.useMemo(() => {
		if (displayValue) return displayValue;
		if (!truncate) return value;
		if (value.length <= prefixChars + suffixChars) return value;
		return `${value.slice(0, prefixChars)}…${value.slice(-suffixChars)}`;
	}, [value, displayValue, truncate, prefixChars, suffixChars]);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1200);
		} catch {}
	};

	return (
		<div
			className={['inline-flex items-center gap-2 min-w-0', className]
				.filter(Boolean)
				.join(' ')}
		>
			<span className='font-mono text-sm truncate' title={value}>
				{shownText}
			</span>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
							className='h-7 w-7'
							onClick={handleCopy}
							aria-label='Copy to clipboard'
						>
							{copied ? (
								<Check className='h-3.5 w-3.5' />
							) : (
								<Copy className='h-3.5 w-3.5' />
							)}
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>{copied ? 'Copied' : 'Copy'}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

export default CopyableText;
