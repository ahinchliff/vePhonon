import { ethers } from 'ethers';
import { getSafeBN } from '../utils/bn';
import { AmountInput, ButtonSendTransaction, SelectLockDuration } from './';

type Props = {
	amountToLock: string;
	phononBalance: ethers.BigNumber | undefined;
	lockDuration: number;
	onMaxAmountToLock: () => void;
	onChangeAmountToLock: (value: string) => void;
	onChangeLockDuration: (newDuration: number) => void;
	onCreateLock: () => Promise<void>;
};

const CreateLock: React.FC<Props> = (props) => {
	const {
		amountToLock,
		lockDuration,
		phononBalance,
		onChangeAmountToLock,
		onChangeLockDuration,
		onMaxAmountToLock,
		onCreateLock,
	} = props;
	return (
		<div className="space-y-6 flex flex-col">
			<AmountInput
				value={amountToLock}
				onChange={onChangeAmountToLock}
				balance={phononBalance}
				onMax={onMaxAmountToLock}
			/>

			<SelectLockDuration
				value={lockDuration}
				onChange={onChangeLockDuration}
				unlockDate={undefined}
			/>

			<ButtonSendTransaction
				className="w-full"
				onClick={onCreateLock}
				disabled={
					!phononBalance ||
					!getSafeBN(amountToLock)?.lte(phononBalance) ||
					getSafeBN(amountToLock)?.eq(0)
				}
			>
				Create Lock
			</ButtonSendTransaction>
		</div>
	);
};

export default CreateLock;
