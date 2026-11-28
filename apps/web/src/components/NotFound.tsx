import { Link } from '@tanstack/react-router';

import { Button } from './ui/button';

const NotFound = () => (
	<div className='flex flex-col items-center justify-center gap-4 text-center min-h-[60vh] px-4'>
		<h1 className='text-2xl font-semibold'>Page not found</h1>
		<p className='text-muted-foreground'>
			We could not find what you were looking for. It may have been removed.
		</p>
		<Button asChild>
			<Link to='/'>Back to home</Link>
		</Button>
	</div>
);

export default NotFound;
