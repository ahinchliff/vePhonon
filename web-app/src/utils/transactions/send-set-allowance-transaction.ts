import { ethers } from 'ethers';
import config from '../../config';
import { ERC20__factory } from '../../contracts';
import { getAllowanceNotifications } from '../../config/notifications';
import sendTransaction from './send-transaction';

const sendIncreaseAllowanceTransaction = async (signer: ethers.Signer) => {
	const phononWithSigner = ERC20__factory.connect(
		config.phononContractAddress,
		signer,
	);
	await sendTransaction(
		phononWithSigner.approve(
			config.vePhononContractAddress,
			ethers.constants.MaxInt256,
		),
		getAllowanceNotifications(),
	);
};

export default sendIncreaseAllowanceTransaction;
