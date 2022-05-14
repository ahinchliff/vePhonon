import classNames from 'classnames';
import {
	getMaxLockTimeInWeeks,
	getFractionOfWeekLeft,
} from '../../utils/calculations';
import { displayWeeks } from '../../utils/format';
import styles from './SelectLockDuration.module.scss';

type Props = {
	value: number;
	onChange: (newDuration: number) => void;
	unlockDate: Date | undefined;
	disabled?: boolean;
};

const SelectLockDuration: React.FC<Props> = (props) => {
	const { value, unlockDate, disabled, onChange } = props;

	const maxLockTime = getMaxLockTimeInWeeks(unlockDate);

	return (
		<div className={styles.SelectLockDuration}>
			<label htmlFor="amount" className="block text-sm font-medium mb-2">
				Lock duration
			</label>
			<div
				className={classNames(
					'mt-1 flex justify-between items-center space-x-7',
					{
						'opacity-50': maxLockTime === 0,
					},
				)}
			>
				<input
					type="range"
					min={!!unlockDate ? 1 : getFractionOfWeekLeft()}
					max={maxLockTime}
					value={value}
					onChange={(e) => onChange(Number(e.target.value))}
					disabled={maxLockTime === 0 || disabled}
				/>
				<div className="text-center">
					<span>
						{displayWeeks(value)} {value > 1 ? 'weeks' : 'week'}
					</span>
				</div>
			</div>
		</div>
	);
};

export default SelectLockDuration;
