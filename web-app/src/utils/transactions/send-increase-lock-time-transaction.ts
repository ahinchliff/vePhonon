import config from '../../config';
import { VePhonon__factory } from '../../contracts';
import { getIncreaseLockTimeNotifications } from '../../config/notifications';
import { getNewUnlockTimeAsUnixSecond } from '../../utils/calculations';
import { ethers } from 'ethers';
import sendTransaction from './send-transaction';

const sendIncreaseLockTimeTransaction = async (
	additionalLockDurationInWeeks: number,
	currentLockEndsAt: Date,
	signer: ethers.Signer,
) => {
	const vePhononWithSigner = VePhonon__factory.connect(
		config.vePhononContractAddress,
		signer,
	);

	await sendTransaction(
		vePhononWithSigner.increase_unlock_time(
			getNewUnlockTimeAsUnixSecond(
				additionalLockDurationInWeeks,
				currentLockEndsAt,
			),
		),
		getIncreaseLockTimeNotifications({
			durationInWeeks: additionalLockDurationInWeeks,
		}),
	);
};

export default sendIncreaseLockTimeTransaction;
