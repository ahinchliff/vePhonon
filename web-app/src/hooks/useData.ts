import * as React from 'react';
import {
	getSystemData,
	getUserData,
	SystemData,
	UserData,
} from '../utils/ve-phonon-data';

const useData = (account: string | undefined) => {
	const [systemData, setSystemData] = React.useState<SystemData>();
	const [userData, setUserData] = React.useState<UserData>();

	const refreshData = React.useCallback(async () => {
		const [newSystemData, newUserData] = await Promise.all([
			getSystemData(),
			account ? getUserData(account) : undefined,
		]);

		setSystemData(newSystemData);
		setUserData(newUserData);
	}, [account]);

	React.useEffect(() => {
		refreshData();
	}, [refreshData]);

	return React.useMemo(
		() => ({
			userData,
			systemData,
			refreshData,
		}),
		[systemData, userData, refreshData],
	);
};

export default useData;
