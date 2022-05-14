import { ethers } from 'ethers';
import config from '../../config';
import { VePhonon__factory } from '../../contracts';
import { getIncreaseAmountNotifications } from '../../config/notifications';
import sendTransaction from './send-transaction';

const sendIncreaseAmountTransaction = async (
	amountToLock: ethers.BigNumber,
	signer: ethers.Signer,
) => {
	const vePhononWithSigner = VePhonon__factory.connect(
		config.vePhononContractAddress,
		signer,
	);

	await sendTransaction(
		vePhononWithSigner.increase_amount(amountToLock),
		getIncreaseAmountNotifications({
			amount: amountToLock,
		}),
	);
};

export default sendIncreaseAmountTransaction;
