import React from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalSearchQuery } from '@/data/queries';
import Image from 'next/image';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const SearchInput = () => {
	const [query, setQuery] = React.useState('');
	const [debouncedQuery, setDebouncedQuery] = React.useState(query);
	const { data } = useGlobalSearchQuery(debouncedQuery);
	const router = useRouter();

	React.useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(query);
		}, 300);

		return () => {
			clearTimeout(handler);
		};
	}, [query]);

	const results = React.useMemo(() => {
		const productResults =
			data?.products?.map(product => ({
				id: product.id,
				title: product.name,
				description: product.description,
				type: 'product' as const,
				image: product.images?.[0]?.path || null
			})) ?? [];

		const storeResults =
			data?.stores?.map(store => ({
				id: store.id,
				title: store.name,
				description: store.description,
				type: 'store' as const,
				image: store.image?.path || null
			})) ?? [];

		return [...productResults, ...storeResults];
	}, [data]);

	return (
		<SearchBar
			query={query}
			placeholder='Search products and stores'
			results={results}
			onQueryChange={setQuery}
			onResultClick={result => {
				if (result.type === 'product') {
					router.push(`/product/${result.id}`);
				} else {
					router.push(`/store/${result.id}`);
				}
			}}
		/>
	);
};

interface SearchResult {
	id: string;
	title: string;
	description?: string;
	image?: string | null;
	type: 'product' | 'store';
}

interface SearchBarProps {
	placeholder?: string;
	query: string;
	results?: SearchResult[];
	onQueryChange?: (query: string) => void;
	onResultClick?: (result: SearchResult) => void;
	className?: string;
}

export function SearchBar({
	query,
	onQueryChange,
	placeholder = 'Search...',
	results = [],
	onResultClick,
	className
}: SearchBarProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const containerRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setIsOpen(value.length > 0);
		onQueryChange?.(value);
	};

	const handleClear = () => {
		setIsOpen(false);
		onQueryChange?.('');
	};

	const handleResultClick = (result: SearchResult) => {
		onQueryChange?.(result.title);
		setIsOpen(false);
		onResultClick?.(result);
	};

	return (
		<div ref={containerRef} className={cn('relative w-full', className)}>
			<div className='relative'>
				<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
				<Input
					type='text'
					placeholder={placeholder}
					value={query}
					onChange={handleInputChange}
					onFocus={() => query.length > 0 && setIsOpen(true)}
					className='pl-9 pr-9'
				/>
				{query && (
					<Button
						variant='ghost'
						size='icon'
						onClick={handleClear}
						className='absolute right-1 top-1/2 size-7 -translate-y-1/2'
					>
						<X className='size-4' />
						<span className='sr-only'>Clear search</span>
					</Button>
				)}
			</div>

			{isOpen && results.length > 0 && (
				<div className='absolute z-50 mt-2 w-full rounded-lg border border-border bg-popover shadow-lg'>
					<div className='max-h-80 overflow-y-auto p-1'>
						{results.map(result => (
							<button
								key={result.id}
								onClick={() => handleResultClick(result)}
								className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent hover:text-accent-foreground'
							>
								<div className='size-10 rounded-md bg-muted overflow-hidden'>
									{result.image && (
										<Image
											src={result.image}
											alt={result.title}
											className='size-full object-cover'
											width={32}
											height={32}
										/>
									)}
								</div>
								<div className='flex min-w-0 flex-col items-start'>
									<span className='font-medium text-popover-foreground truncate'>
										{result.title}
									</span>
									{result.description && (
										<span className='text-sm text-muted-foreground line-clamp-1'>
											{result.description}
										</span>
									)}
								</div>
							</button>
						))}
					</div>
				</div>
			)}

			{isOpen && query.length > 0 && results.length === 0 && (
				<div className='absolute z-50 mt-2 w-full rounded-lg border border-border bg-popover p-4 text-center shadow-lg'>
					<p className='text-sm text-muted-foreground'>No results found</p>
				</div>
			)}
		</div>
	);
}

export default SearchInput;
