import fs from 'fs';

const loadBanks = async () => {
	const response = await fetch('http://localhost:4000/paystack/list', {
		headers: {}
	});

	const data = await response.json();

	return data;
};

const writeBanksToDisk = (banks: any) => {
	fs.writeFileSync(
		'./src/utils/banks.ts',
		`export const BANKS = ${JSON.stringify(banks)}`
	);
};

const main = async () => {
	const banks = loadBanks();

	writeBanksToDisk(banks);
};

main();
