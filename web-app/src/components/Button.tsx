import classnames from 'classnames';

export type Props = React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

const Button: React.FC<Props> = (props) => {
	const { children, className, disabled, ...rest } = props;

	return (
		<button
			type="button"
			className={classnames(
				'phonon-bg-gradient rounded p-2 px-5 shadow-lg shadow-cyan-200/40 ease-in-out duration-300',
				className,
				{
					'opacity-60': disabled,
					'hover:shadow-cyan-100/70 hover:hue-rotate-90 hover:shadow-lg':
						!disabled,
				},
			)}
			disabled={disabled}
			{...rest}
		>
			{children}
		</button>
	);
};

export default Button;
