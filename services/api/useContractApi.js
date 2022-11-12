

export default function useContract(privateKey) {
	let contract = null;
	const fetchData = async () => {
		try {
			const fullNode = 'https://api.nileex.io';
			const solidityNode = 'https://api.nileex.io';
			const eventServer = 'https://event.nileex.io';
			const privateKey = privateKey;
			const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
			contract = await tronWeb.contract().at('TBT8DZwpUCdTknZvvyWbtjn5xG3LK9oqHz');
	

		} catch (error) {
			console.error(error);
		}
	};

	fetchData();
	return contract;



}


