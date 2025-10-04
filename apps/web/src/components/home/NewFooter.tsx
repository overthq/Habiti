import Link from 'next/link';

export const NewFooter = () => {
	return (
		<div className='flex items-center justify-center'>
			<div className='max-w-200 w-full flex justify-between p-4 text-sm'>
				<p>&copy; Habiti {new Date().getFullYear()}</p>
				<div className='flex gap-4'>
					<Link
						href='/acceptable-use'
						className='text-sm text-muted-foreground'
					>
						Acceptable Use
					</Link>
					<Link
						href='/privacy-policy'
						className='text-sm text-muted-foreground'
					>
						Privacy
					</Link>
					<Link href='/support' className='text-sm text-muted-foreground'>
						Contact
					</Link>
				</div>
			</div>
		</div>
	);
};

export default NewFooter;
