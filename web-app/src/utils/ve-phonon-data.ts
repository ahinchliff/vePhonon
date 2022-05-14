import { ethers } from 'ethers';
import { VePhonon__factory, ERC20__factory } from '../contracts';
import config from '../config';

export type SystemData = {
	vePhononTotalSupply: ethers.BigNumber;
	phononTotalLocked: ethers.BigNumber;
};

export type UserData = {
	vePhononBalance: ethers.BigNumber;
	lockedPhonon: ethers.BigNumber;
	lockEndsAt: Date;
	phononBalance: ethers.BigNumber;
	phononVePhononAllowance: ethers.BigNumber;
	hasLock: boolean;
	canWithdraw: boolean;
};

const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);

const vePhonon = VePhonon__factory.connect(
	config.vePhononContractAddress,
	provider,
);

const phononToken = ERC20__factory.connect(
	config.phononContractAddress,
	provider,
);

export const getSystemData = async (): Promise<SystemData> => {
	const [vePhononTotalSupply, phononTotalLocked] = await Promise.all([
		vePhonon['totalSupply()'](),
		vePhonon.totalFXSSupply(),
	]);

	return {
		vePhononTotalSupply,
		phononTotalLocked,
	};
};

export const getUserData = async (account: string): Promise<UserData> => {
	const [vePhononBalance, lock, phononBalance, phononVePhononAllowance] =
		await Promise.all([
			vePhonon['balanceOf(address)'](account),
			vePhonon.locked(account, {
				gasLimit: 100000, // this view requires a gas limit *shrugs*
			}),
			phononToken.balanceOf(account),
			phononToken.allowance(account, vePhonon.address),
		]);

	const hasLock = lock.amount.gt(0);
	const lockEndsAt = new Date(lock.end.toNumber() * 1000);

	return {
		vePhononBalance,
		lockedPhonon: lock.amount,
		lockEndsAt,
		phononBalance,
		phononVePhononAllowance,
		hasLock,
		canWithdraw: hasLock && lockEndsAt < new Date(),
	};
};
