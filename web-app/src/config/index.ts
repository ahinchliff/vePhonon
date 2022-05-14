const getEnvVariable = (property: string, canBeUndefined = false): string => {
	const value = process.env[property];
	if (!canBeUndefined && !value) {
		throw new Error(`${property} environment variable is not set`);
	}
	return value as string;
};

const config = {
	chainId: Number(getEnvVariable('REACT_APP_CHAIN_ID')),
	vePhononContractAddress: getEnvVariable(
		'REACT_APP_VE_PHONON_CONTRACT_ADDRESS',
	),
	phononContractAddress: getEnvVariable('REACT_APP_PHONON_CONTRACT_ADDRESS'),
	rpcUrl: getEnvVariable('REACT_APP_RPC_URL'),
};

export default config;
