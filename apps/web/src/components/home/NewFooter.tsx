import { Link } from '@tanstack/react-router';

export const NewFooter = () => {
	return (
		<div className='flex items-center justify-center'>
			<div className='max-w-200 w-full flex justify-between p-4 text-sm'>
				<p>&copy; Habiti {new Date().getFullYear()}</p>
				<div className='flex gap-4'>
					<Link to='/acceptable-use' className='text-sm text-muted-foreground'>
						Acceptable Use
					</Link>
					<Link to='/privacy-policy' className='text-sm text-muted-foreground'>
						Privacy
					</Link>
					<Link to='/support' className='text-sm text-muted-foreground'>
						Contact
					</Link>
				</div>
			</div>
		</div>
	);
};

export default NewFooter;
