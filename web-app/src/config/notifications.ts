import { ethers } from 'ethers';
import { displayPhonon, displayWeeks } from '../utils/format';
import { NotificationMessages } from '../utils/transactions/send-transaction';

type CreateLockNotificationArgs = {
	amount: ethers.BigNumber;
	durationInWeeks: number;
};

export const getCreateLockNotifications = ({
	amount,
	durationInWeeks,
}: CreateLockNotificationArgs): NotificationMessages => {
	const base = `${displayPhonon(amount)} PHONON for ${displayWeeks(
		durationInWeeks,
	)} weeks`;

	return {
		awaitingApproval: `Follow wallet instructions to lock ${base}`,
		pending: `Transaction pending to lock ${base}`,
		success: `Successfully locked ${base}`,
		error: 'Locking failed',
	};
};

export const getAllowanceNotifications = (): NotificationMessages => {
	return {
		awaitingApproval: `Follow wallet instructions to allow vePHONON to access your PHONON`,
		pending: `Transaction pending to allow vePHONON to access your PHONON`,
		success: `Successfully allowed vePHONON to access your PHONON`,
		error: 'Granting allowance to vePHONON failed',
	};
};

export const getIncreaseAmountNotifications = ({
	amount,
}: {
	amount: ethers.BigNumber;
}): NotificationMessages => {
	const base = `an additional ${displayPhonon(amount)} PHONON`;

	return {
		awaitingApproval: `Follow wallet instructions to lock ${base}`,
		pending: `Transaction pending to lock ${base}`,
		success: `Successfully locked ${base}`,
		error: 'Locking failed',
	};
};

export const getIncreaseLockTimeNotifications = ({
	durationInWeeks,
}: {
	durationInWeeks: number;
}): NotificationMessages => {
	const base = `your lock by ${displayWeeks(durationInWeeks)} weeks`;

	return {
		awaitingApproval: `Follow wallet instructions to increase ${base}`,
		pending: `Transaction pending to increase ${base}`,
		success: `Successfully increased ${base}`,
		error: 'Increaing lock time failed',
	};
};

export const getWithdrawNotifications = (): NotificationMessages => {
	const base = `your locked PHONON`;

	return {
		awaitingApproval: `Follow wallet instructions to withdraw ${base}`,
		pending: `Transaction pending to withdraw ${base}`,
		success: `Successfully withdrew ${base}`,
		error: 'Withdraw failed',
	};
};
