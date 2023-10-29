export const plural = (word: string, count: number) => {
	return `${count} ${word}${count > 1 ? 's' : ''}`;
};

export const capitalize = (word: string) => {
	return word.charAt(0).toUpperCase() + word.slice(1);
};
