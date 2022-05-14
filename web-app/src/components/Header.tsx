import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { truncateAddress } from '../utils/format';
import Button from './Button';

const Header: React.FC = () => {
	const { data: accountData } = useAccount();
	const { connect, connectors, isConnected } = useConnect();
	const { disconnect } = useDisconnect();

	const onWalletButtonPress = () => {
		if (isConnected) {
			disconnect();
		} else {
			connect(connectors[0]);
		}
	};

	return (
		<div className="px-5 flex py-3 justify-between">
			<img src="/images/phonon-logo.svg" className="h-12" alt="Phonon Logo" />
			<div className="md:flex">
				{isConnected && accountData?.address && (
					<div className="backdrop-blur py-3 px-3 shadow sm:rounded-lg">
						<span className="phonon-text-gradient">
							{truncateAddress(accountData.address)}
						</span>
					</div>
				)}
				<Button onClick={onWalletButtonPress}>
					{isConnected ? 'Disconnect' : 'Connect'}
				</Button>
			</div>
		</div>
	);
};

export default Header;
