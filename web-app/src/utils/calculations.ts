import { ethers } from 'ethers';
import {
	SECONDS_IN_A_WEEK,
	MAX_LOCK_IN_WEEKS,
	MAX_VE_PHONON_MULTIPLIER,
	MAX_LOCK,
} from '../config/constants';

export const getRemainingSecondsInCurrentWeek = () => {
	const now = Math.floor(Date.now() / 1000);
	return now % SECONDS_IN_A_WEEK;
};

export const getFractionOfWeekLeft = () => {
	const remainingSeconds = getRemainingSecondsInCurrentWeek();
	return 1 - remainingSeconds / SECONDS_IN_A_WEEK;
};

export const getNewUnlockTimeAsUnixSecond = (
	lockDurationInWeeks: number,
	currentUnlockTime: Date = new Date(),
) =>
	Math.floor(
		currentUnlockTime.getTime() / 1000 +
			SECONDS_IN_A_WEEK * lockDurationInWeeks,
	);

export const getMaxLockTimeInWeeks = (currentUnlockTime: Date | undefined) => {
	if (!currentUnlockTime) {
		return MAX_LOCK_IN_WEEKS;
	}

	const existingLockTimeInSeconds =
		(currentUnlockTime.getTime() - new Date().getTime()) / 1000;

	const existingLockTimeInWeeks = existingLockTimeInSeconds / SECONDS_IN_A_WEEK;

	return Math.floor(MAX_LOCK_IN_WEEKS - existingLockTimeInWeeks);
};

export const getNewUnlockTime = (
	lockDurationInWeeks: number,
	currentUnlockTime: Date = new Date(),
) => {
	const asUnixSeconds = getNewUnlockTimeAsUnixSecond(
		lockDurationInWeeks,
		currentUnlockTime,
	);

	return new Date(asUnixSeconds * 1000);
};

export const calculateAdditionalVePhononToReceive = (
	depositAmount: ethers.BigNumber,
	lockDurationInWeeks: number,
) => {
	const lockDurationInSeconds = ethers.utils
		.parseEther(lockDurationInWeeks.toString())
		.mul(SECONDS_IN_A_WEEK);

	const percentageOfMaxLock = lockDurationInSeconds.div(MAX_LOCK);

	return depositAmount.add(
		depositAmount
			.mul(percentageOfMaxLock.mul(MAX_VE_PHONON_MULTIPLIER))
			.div(ethers.constants.WeiPerEther),
	);
};
