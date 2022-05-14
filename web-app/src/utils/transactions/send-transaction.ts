import { ethers } from 'ethers';
import { toast } from 'react-toastify';

export type NotificationMessages = {
	awaitingApproval: string;
	pending: string;
	success: string;
	error: string;
};

const sendTransaction = async (
	tx: Promise<ethers.ContractTransaction>,
	messages: NotificationMessages,
) => {
	const approvalNotification = toast.success(messages.awaitingApproval, {
		autoClose: false,
	});

	let pendingTx;

	try {
		pendingTx = await tx;
		toast.dismiss(approvalNotification);
	} catch (err) {
		console.error(err);
		const error = err as { code?: number; message?: string };
		const isCancelled = error.code === 4001;

		const message = isCancelled ? 'Transaction cancelled' : error.message;

		toast.error(message || messages.error);
		toast.dismiss(approvalNotification);
		throw err;
	}

	const transactionPendingNotification = toast.success(messages.pending, {
		autoClose: false,
	});

	await pendingTx.wait(1);
	toast.dismiss(transactionPendingNotification);
	toast.success(messages.success, { autoClose: false });
};

export default sendTransaction;
