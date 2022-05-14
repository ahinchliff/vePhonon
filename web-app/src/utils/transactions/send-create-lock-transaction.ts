import { ethers } from 'ethers';
import config from '../../config';
import { VePhonon__factory } from '../../contracts';
import sendTransaction from './send-transaction';
import { getCreateLockNotifications } from '../../config/notifications';
import { getNewUnlockTimeAsUnixSecond } from '../calculations';

const sendCreateLockTransaction = async (
	amountToLock: ethers.BigNumber,
	lockDurationsInWeeks: number,
	signer: ethers.Signer,
) => {
	const vePhonon = VePhonon__factory.connect(
		config.vePhononContractAddress,
		signer,
	);

	await sendTransaction(
		vePhonon.create_lock(
			amountToLock,
			getNewUnlockTimeAsUnixSecond(lockDurationsInWeeks),
		),
		getCreateLockNotifications({
			amount: amountToLock,
			durationInWeeks: lockDurationsInWeeks,
		}),
	);
};

export default sendCreateLockTransaction;
