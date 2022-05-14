import { ethers } from 'ethers';
import sendTransaction from './send-transaction';
import config from '../../config';
import { VePhonon__factory } from '../../contracts';
import { getWithdrawNotifications } from '../../config/notifications';

const sendWithdrawTransaction = async (signer: ethers.Signer) => {
	if (!signer) {
		return console.error('No signer or account');
	}

	const vePhononWithSigner = VePhonon__factory.connect(
		config.vePhononContractAddress,
		signer,
	);

	return sendTransaction(
		vePhononWithSigner.withdraw(),
		getWithdrawNotifications(),
	);
};

export default sendWithdrawTransaction;
