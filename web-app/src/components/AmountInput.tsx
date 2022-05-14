import { ethers } from 'ethers';
import { displayPhonon } from '../utils/format';

type Props = {
	balance: ethers.BigNumber | undefined;
	value: string;
	disabled?: boolean;
	onMax: () => void;
	onChange: (value: string) => void;
};

const AmountInput: React.FC<Props> = (props) => {
	const { balance, value, disabled, onChange, onMax } = props;
	return (
		<div>
			<div className="flex justify-between mb-2">
				<label htmlFor="amount" className="block text-sm font-medium ">
					PHONON to lock
				</label>
				{balance && (
					<button className="text-xs" onClick={onMax}>
						Max: {displayPhonon(balance)}
					</button>
				)}
			</div>
			<div className="mt-1">
				<input
					id="amount"
					name="amount"
					type="number"
					className="appearance-none block w-full px-3 py-2 border-2 border-indigo-400 bg-cyan-900/[.4] rounded-md shadow-smfocus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					disabled={disabled}
				/>
			</div>
		</div>
	);
};

export default AmountInput;
