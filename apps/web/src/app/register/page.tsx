const RegisterPage = () => {
	return (
		<div>
			<form className='space-y-4'>
				<div>
					<label
						htmlFor='name'
						className='block text-sm font-medium text-gray-700'
					>
						Name
					</label>
					<input
						type='text'
						id='name'
						name='name'
						className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
						required
					/>
				</div>
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
				<div>
					<label
						htmlFor='password'
						className='block text-sm font-medium text-gray-700'
					>
						Password
					</label>
					<input
						type='password'
						id='password'
						name='password'
						className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
						required
					/>
				</div>
				<button
					type='submit'
					className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
				>
					Register
				</button>
			</form>
		</div>
	);
};

export default RegisterPage;
