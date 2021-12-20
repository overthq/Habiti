const monoConfig = {
	publicKey: '',
	onSuccess: () => {
		console.log('Success!');
	},
	onClose: () => {
		console.log('Closed');
	},
	onEvent: (eventName: string, data: any) => {
		console.log({ eventName, data });
	}
};

// TODO: Parse specific events using `onEvent`

export default monoConfig;
