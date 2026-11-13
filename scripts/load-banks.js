// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires

const writeBanksToDisk = banks => {
	fs.writeFileSync(
		require('path').join(__dirname, '../packages/common/src/banks.ts'),
		`export const BANKS = ${JSON.stringify(banks)}`
	);
};

const main = async () => {
	const banks = await loadBanks();

	writeBanksToDisk(banks);
};

main();
