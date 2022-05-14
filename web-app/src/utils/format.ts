import { ethers } from 'ethers';

export const truncateAddress = (
	address: string,
	startChars: number = 6,
	endChars: number = 4,
) => {
	return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

export const displayPhonon = (bn: ethers.BigNumber | undefined) => {
	return bn
		? parseFloat(ethers.utils.formatUnits(bn, 18)).toLocaleString(undefined, {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
		  })
		: undefined;
};

export const displayWeeks = (weeks: number) =>
	weeks.toLocaleString(undefined, {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	});
