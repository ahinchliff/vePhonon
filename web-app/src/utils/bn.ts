import { ethers } from 'ethers';

export const getSafeBN = (
	number: string,
	decimals: number = 18,
): ethers.BigNumber | undefined => {
	try {
		return ethers.utils.parseUnits(number, decimals);
	} catch (error) {
		return undefined;
	}
};
