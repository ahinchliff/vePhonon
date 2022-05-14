import { WagmiProvider, chain as chains, createClient } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { ToastContainer } from 'react-toastify';
import { Header } from './components';
import config from './config';
import Home from './navigation/Home';
import 'react-toastify/dist/ReactToastify.css';

const client = createClient({
	autoConnect: true,
	connectors() {
		const chain = Object.values(chains).find((c) => c.id === config.chainId);

		if (!chain) {
			throw new Error(`Chain with id ${config.chainId} not found`);
		}

		return [
			new InjectedConnector({
				chains: [chain],
				options: { name: 'Injected' },
			}),
		];
	},
});

const App = () => {
	return (
		<>
			<div className="App h-screen w-full">
				<WagmiProvider client={client}>
					<Header />
					<Home />
				</WagmiProvider>
			</div>
			<ToastContainer position="bottom-right" />
		</>
	);
};

export default App;
