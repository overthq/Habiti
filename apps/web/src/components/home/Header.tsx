import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
	return (
		<nav className='sticky top-0 z-40 border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/75'>
			<div className='container py-4 flex justify-between items-center'>
				<Link href='/' className='flex items-center gap-2'>
					<Image
						src='/images/habiti-wordmark-black.svg'
						alt='Habiti'
						height={24}
						width={80}
						className='dark:invert'
					/>
				</Link>
				<div className='flex items-center gap-3'>
					<Link
						href='/login'
						className='text-sm text-muted-foreground hover:text-foreground'
					>
						Log in
					</Link>
					<Link
						href='/register'
						className='inline-flex h-9 items-center rounded-md bg-foreground px-4 text-sm font-medium text-background hover:bg-foreground/90'
					>
						Get started
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default Header;
