const LoginPage = () => {
	return (
		<div>
			<form className='space-y-4'>
				<div>
					<label
						htmlFor='email'
						className='block text-sm font-medium text-gray-700'
					>
						Email
					</label>
					<input
						type='email'
						id='email'
						name='email'
						className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
						required
					/>
				</div>
			</form>
		</div>
	);
};

export default LoginPage;
