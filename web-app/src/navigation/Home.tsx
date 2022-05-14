import * as React from 'react';
import { ethers } from 'ethers';
import { useAccount, useSigner } from 'wagmi';
import { ButtonSendTransaction, CreateLock, EditLock } from '../components';
import { displayPhonon } from '../utils/format';
import { getSafeBN } from '../utils/bn';
import { SystemData } from '../utils/ve-phonon-data';
import useData from '../hooks/useData';
import {
	calculateAdditionalVePhononToReceive,
	getFractionOfWeekLeft,
	getNewUnlockTime,
} from '../utils/calculations';
import { EditTab } from '../components/EditLock';
import sendWithdrawTransaction from '../utils/transactions/send-withdraw-transaction';
import sendCreateLockTransaction from '../utils/transactions/send-create-lock-transaction';
import sendIncreaseLockTimeTransaction from '../utils/transactions/send-increase-lock-time-transaction';
import sendIncreaseAmountTransaction from '../utils/transactions/send-increase-amount-transaction';
import sendIncreaseAllowanceTransaction from '../utils/transactions/send-set-allowance-transaction';

const DEFAULT_AMOUNT = '';
const remainingTimeInWeek = getFractionOfWeekLeft();

const Home: React.FC = () => {
	const { data: accountData } = useAccount();
	const { data: signer } = useSigner();
	const [amountToLock, setAmountToLock] =
		React.useState<string>(DEFAULT_AMOUNT);
	const [lockDurationInWeeks, setLockDurationInWeeks] =
		React.useState<number>(remainingTimeInWeek);
	const { systemData, userData, refreshData } = useData(accountData?.address);
	const [editTab, setEditTab] = React.useState<EditTab>('amount');

	const amountToLockBN = getSafeBN(amountToLock);

	React.useEffect(() => {
		if (userData?.hasLock && lockDurationInWeeks < 1) {
			setLockDurationInWeeks(1);
		}

		if (!userData?.hasLock && lockDurationInWeeks === 1) {
			setLockDurationInWeeks(remainingTimeInWeek);
		}
	}, [lockDurationInWeeks, userData]);

	const resetForm = () => {
		setAmountToLock(DEFAULT_AMOUNT);
		setLockDurationInWeeks(remainingTimeInWeek);
	};

	const onCreateLock = async () => {
		if (!signer || !amountToLockBN || !userData) {
			return;
		}

		if (userData.phononVePhononAllowance.lt(amountToLockBN)) {
			await sendIncreaseAllowanceTransaction(signer);
			refreshData();
		}

		await sendCreateLockTransaction(
			amountToLockBN,
			lockDurationInWeeks,
			signer,
		);
		await refreshData();
		resetForm();
	};

	const onWithdraw = async () => {
		if (!signer) {
			return;
		}
		await sendWithdrawTransaction(signer);
		await refreshData();
	};

	const onIncreaseAmount = async () => {
		if (!signer || !amountToLockBN || !userData) {
			return;
		}

		if (userData.phononVePhononAllowance.lt(amountToLockBN)) {
			await sendIncreaseAllowanceTransaction(signer);
			refreshData();
		}

		sendIncreaseAmountTransaction(amountToLockBN, signer);
		await refreshData();
		resetForm();
	};

	const onIncreaseLockTime = async () => {
		if (!signer || !lockDurationInWeeks || !userData) {
			return;
		}
		await sendIncreaseLockTimeTransaction(
			lockDurationInWeeks,
			userData.lockEndsAt,
			signer,
		);
		await refreshData();
		resetForm();
	};

	const onSetMaxAmount = () => {
		if (userData?.phononBalance) {
			setAmountToLock(ethers.utils.formatEther(userData?.phononBalance));
		}
	};

	const updatedLockedPhononAmount =
		userData && amountToLockBN
			? userData.lockedPhonon.add(amountToLockBN)
			: amountToLockBN;

	const additionalVePhononToReceive =
		amountToLockBN &&
		calculateAdditionalVePhononToReceive(amountToLockBN, lockDurationInWeeks);

	const updatedVePhonon =
		userData && additionalVePhononToReceive
			? userData.vePhononBalance.add(additionalVePhononToReceive)
			: additionalVePhononToReceive;

	return (
		<div className="flex flex-col justify-center mt-8 sm:mx-auto sm:w-full sm:max-w-4xl backdrop-blur py-8 px-4 shadow sm:rounded-lg sm:px-10">
			<h1 className="text-3xl phonon-text-gradient mb-5">vePHONON</h1>
			<div className="sm:grid grid-cols-2 gap-x-16 gap-y-5">
				<div>
					<p className="text-sm">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vel
						neque velit. Duis at justo gravida ante volutpat volutpat non id
						urna. Pellentesque nec lectus ligula. Nam suscipit, augue consequat
						laoreet commodo, justo sapien pretium sapien, non bibendum tellus
						orci nec felis. Etiam arcu massa, tempus id nulla non, cursus
						tincidunt arcu.
					</p>
				</div>

				<div className="pt-5 sm:pt-0">
					<table className="table-auto w-full text-sm">
						<tbody>
							<tr>
								<td className="pb-1">Total vePHONON</td>
								<td className="text-right">
									<DisplaySystemData
										systemData={systemData}
										property={'vePhononTotalSupply'}
									/>
								</td>
							</tr>
							<tr>
								<td className="pb-1">Total Locked PHONON</td>
								<td className="text-right">
									<DisplaySystemData
										systemData={systemData}
										property={'phononTotalLocked'}
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div className="col-span-2">
					<h2 className="mt-5 sm:mt-0 phonon-text-gradient text-xl mb-3">
						Your lock
					</h2>
				</div>

				{!userData?.hasLock ? (
					<CreateLock
						amountToLock={amountToLock}
						phononBalance={userData?.phononBalance}
						lockDuration={lockDurationInWeeks}
						onMaxAmountToLock={onSetMaxAmount}
						onChangeAmountToLock={setAmountToLock}
						onChangeLockDuration={setLockDurationInWeeks}
						onCreateLock={onCreateLock}
					/>
				) : (
					<EditLock
						tab={editTab}
						onChangeTab={setEditTab}
						amountToLock={amountToLock}
						phononBalance={userData.phononBalance}
						lockDuration={lockDurationInWeeks}
						unlockDate={userData.lockEndsAt}
						onMaxAmountToLock={onSetMaxAmount}
						onChangeAmountToLock={setAmountToLock}
						onChangeLockDuration={setLockDurationInWeeks}
						onTabChange={resetForm}
						onIncreaseAmount={onIncreaseAmount}
						onIncreaseLockTime={onIncreaseLockTime}
					/>
				)}

				<div className="pt-5 sm:pt-0 flex flex-col justify-between">
					<div className="grid grid-cols-7 text-sm">
						<div className="col-span-3 pb-1">vePHONON balance</div>
						<div className="col-span-4 text-right">
							<DisplayUserData
								accountConnected={!!accountData}
								currentData={displayPhonon(userData?.vePhononBalance)}
								updatedData={displayPhonon(updatedVePhonon)}
							/>
						</div>
						<div className="col-span-3 pb-1">Locked PHONON</div>
						<div className="col-span-4 text-right">
							<DisplayUserData
								accountConnected={!!accountData}
								currentData={displayPhonon(userData?.lockedPhonon)}
								updatedData={displayPhonon(updatedLockedPhononAmount)}
							/>
						</div>

						<div className="col-span-3 pb-1">Unlock date</div>
						<div className="col-span-4 text-right">
							<DisplayUserData
								accountConnected={!!accountData}
								currentData={
									// forgive me lawd for I have sinned
									userData?.lockEndsAt
										? userData.lockEndsAt > new Date()
											? userData.lockEndsAt.toLocaleDateString()
											: 'Unlocked'
										: undefined
								}
								updatedData={
									(!userData?.hasLock && amountToLock === '') ||
									(userData?.hasLock && editTab === 'amount')
										? undefined
										: getNewUnlockTime(
												lockDurationInWeeks,
												userData?.lockEndsAt && userData.lockEndsAt > new Date()
													? userData.lockEndsAt
													: undefined,
										  ).toLocaleDateString()
								}
							/>
						</div>
					</div>
					<ButtonSendTransaction
						className="w-full mt-4 sm:mt-0"
						onClick={onWithdraw}
						disabled={!userData?.canWithdraw}
					>
						Withdraw
					</ButtonSendTransaction>
				</div>
			</div>
		</div>
	);
};

export default Home;

const DisplaySystemData: React.FC<{
	systemData: SystemData | undefined;
	property: keyof SystemData;
}> = (props) => {
	if (!props.systemData) {
		return <span>Loading...</span>;
	}

	return <span>{displayPhonon(props.systemData[props.property]) || ''}</span>;
};

const DisplayUserData: React.FC<{
	currentData: string | undefined;
	updatedData: string | undefined;
	accountConnected: boolean;
}> = (props) => {
	if (props.accountConnected && !props.currentData) {
		return <span>Loading...</span>;
	}

	if (!props.updatedData && !props.currentData) {
		return <span>-</span>;
	}

	if (props.updatedData && props.currentData) {
		return (
			<div className="grid grid-cols-3">
				<div className="text-left">{props.currentData}</div>
				<div className="text-center">{'->'}</div>
				<div className="text-right">{props.updatedData}</div>
			</div>
		);
	}

	if (!props.currentData && props.updatedData) {
		return <span>{props.updatedData}</span>;
	}

	return <span>{props.currentData}</span>;
};
