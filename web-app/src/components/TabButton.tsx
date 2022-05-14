import classnames from 'classnames';

type Props = React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
> & {
	selected: boolean;
};

const TabButton: React.FC<Props> = (props) => {
	const { selected, children, ...rest } = props;
	return (
		<button
			type="button"
			className={classnames('w-40 pb-2 border-b-2', {
				'border-b-2 border-b-indigo-400': selected,
				'border-transparent': !selected,
			})}
			{...rest}
		>
			{children}
		</button>
	);
};

export default TabButton;
