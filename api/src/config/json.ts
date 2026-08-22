declare global {
	interface BigInt {
		toJSON(): number;
	}
}

BigInt.prototype.toJSON = function () {
	const value = Number(this);

	if (!Number.isSafeInteger(value)) {
		throw new TypeError(
			`BigInt ${this.toString()} exceeds Number.MAX_SAFE_INTEGER and cannot be serialized without precision loss.`
		);
	}

	return value;
};

export {};
