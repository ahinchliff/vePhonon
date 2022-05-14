import * as React from 'react';
import { ethers } from 'ethers';
import { getSafeBN } from '../utils/bn';
import {
	AmountInput,
	ButtonSendTransaction,
	SelectLockDuration,
	TabButton,
} from './';
import { getMaxLockTimeInWeeks } from '../utils/calculations';

export type EditTab = 'amount' | 'duration';

type Props = {
	tab: EditTab;
	amountToLock: string;
	phononBalance: ethers.BigNumber | undefined;
	lockDuration: number;
	unlockDate: Date;
	onChangeTab: (tab: EditTab) => void;
	onMaxAmountToLock: () => void;
	onChangeAmountToLock: (value: string) => void;
	onChangeLockDuration: (newDuration: number) => void;
	onTabChange: () => void;
	onIncreaseAmount: () => Promise<void>;
	onIncreaseLockTime: () => Promise<void>;
};

const EditLock: React.FC<Props> = (props) => {
	const {
		tab,
		amountToLock,
		lockDuration,
		phononBalance,
		unlockDate,
		onChangeAmountToLock,
		onChangeLockDuration,
		onMaxAmountToLock,
		onIncreaseAmount,
		onTabChange,
		onIncreaseLockTime,
		onChangeTab,
	} = props;

	const internalOnTabChange = (newTab: EditTab) => {
		onTabChange();
		onChangeTab(newTab);
	};

	const maxLockTime = getMaxLockTimeInWeeks(unlockDate);

	const canWithdraw = new Date() >= unlockDate;

	return (
		<div className="flex flex-col space-y-6">
			<div className="flex justify-center space-x-6">
				<TabButton
					selected={tab === 'amount'}
					onClick={() => internalOnTabChange('amount')}
				>
					Increase deposit
				</TabButton>
				<TabButton
					selected={tab === 'duration'}
					onClick={() => internalOnTabChange('duration')}
				>
					Extend time
				</TabButton>
			</div>

			{tab === 'amount' && (
				<>
					<AmountInput
						value={amountToLock}
						onChange={onChangeAmountToLock}
						balance={phononBalance}
						onMax={onMaxAmountToLock}
						disabled={canWithdraw}
					/>
					<ButtonSendTransaction
						className="w-full"
						onClick={onIncreaseAmount}
						disabled={
							!phononBalance ||
							!getSafeBN(amountToLock)?.lte(phononBalance) ||
							getSafeBN(amountToLock)?.eq(0)
						}
					>
						Increase deposit
					</ButtonSendTransaction>
				</>
			)}

			{tab === 'duration' && (
				<>
					<SelectLockDuration
						value={lockDuration}
						onChange={onChangeLockDuration}
						unlockDate={unlockDate}
						disabled={canWithdraw}
					/>
					<ButtonSendTransaction
						className="w-full"
						onClick={onIncreaseLockTime}
						disabled={maxLockTime === 0 || canWithdraw}
					>
						Extend time
					</ButtonSendTransaction>
				</>
			)}
		</div>
	);
};

export default EditLock;
