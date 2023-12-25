// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('node-fetch');

const loadBanks = async () => {
	const response = await fetch('https://api.paystack.co/bank?country=nigeria', {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	});

	const { data } = await response.json();

	return data;
};

const writeBanksToDisk = banks => {
	fs.writeFileSync(
		'./dashboard/src/utils/banks.ts',
		`export const BANKS = ${JSON.stringify(banks)}`
	);
};

const main = async () => {
	const banks = await loadBanks();

	writeBanksToDisk(banks);
};

main();
