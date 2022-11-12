import { useState, useEffect } from 'react';

export default function useContract() {
	const [contractInstance, setContractInstance] = useState({
		contract: null,
		signerAddress: null,
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const contract = { contract: null, signerAddress: null };

				contract.contract =  await window.tronWeb.contract().at('TYwY78jsnnH1csRDzUfw8MxGgXffoe4uG2');

				contract.signerAddress =  window.tronWeb.defaultAddress.base58;

				setContractInstance(contract);
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
	}, []);

	return contractInstance;
}