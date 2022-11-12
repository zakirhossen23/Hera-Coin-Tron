import { ethers } from 'ethers';

const sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export default async function send_token(
	send_token_amount,
	to_address,
	private_key
) {
	const fullNode = 'https://api.nileex.io';
	const solidityNode = 'https://api.nileex.io';
	const eventServer = 'https://event.nileex.io';
	const privateKey = privateKey;
	const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, private_key);
	contract = await tronWeb.contract().at('TBT8DZwpUCdTknZvvyWbtjn5xG3LK9oqHz');

	let send_account = await tronWeb.address.fromPrivateKey(private_key);
	const tx = {
		from: send_account,
		to: to_address,
		value: ethers.utils.parseEther(send_token_amount),
	}
	await walletSigner.sendTransaction(tx);
	
	return send_account;
}