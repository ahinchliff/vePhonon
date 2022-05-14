import { useNetwork } from 'wagmi';
import config from '../config';
import { Button } from './';
import { Props as ButtonProps } from './Button';

type Props = ButtonProps;

const ButtonSendTransaction: React.FC<Props> = (props) => {
	const { onClick, ...rest } = props;
	const { activeChain, switchNetwork } = useNetwork();

	const onClickInternal = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		const isCorrectChain = activeChain?.id === config.chainId;
		if (activeChain && !isCorrectChain) {
			if (switchNetwork) {
				switchNetwork(config.chainId);
			}
		}

		if (onClick) {
			onClick(event);
		}
	};

	return <Button {...rest} onClick={onClickInternal} />;
};

export default ButtonSendTransaction;
