import NewFooter from '@/components/home/NewFooter';

const AuthLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<div className='bg-muted min-h-svh flex flex-col'>
			<div className='flex flex-1'>{children}</div>
			<NewFooter />
		</div>
	);
};

export default AuthLayout;
