import { Link } from '@tanstack/react-router';

const Header = () => {
	return (
		<nav className='sticky top-0 z-40 border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/75'>
			<div className='container py-4 flex justify-between items-center'>
				<Link to='/' className='flex items-center gap-2'>
					<img
						src='/images/habiti-wordmark-black.svg'
						alt='Habiti'
						height={24}
						width={80}
						className='dark:invert'
					/>
				</Link>
			</div>
		</nav>
	);
};

export default Header;
