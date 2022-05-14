import { ethers } from "ethers";
import { LedgerSigner } from "@ethersproject/hardware-wallets";

export const getLedgerSigner = (index: number, provider: any): LedgerSigner => {
  const signer = new LedgerSigner(provider, undefined, `44'/60'/${index}'/0/0`);
  // Fix signing for EIP-1559 while ethers.js isn't fixed.
  signer.signTransaction = ledgerSignTransaction;
  return signer;
};

export const getSigner = async (
  e: any,
  ledgerAccountIndex: number | undefined
): Promise<ethers.Signer> =>
  ledgerAccountIndex
    ? getLedgerSigner(ledgerAccountIndex, e.provider)
    : (await e.getSigners())[0];

/*
 * Fixes LedgerSigner for EIP1559 while ethers.js isn't fixed.
 * The package.json also uses "resolutions" to upgrade the ledger
 * dependencies to the correct version.
 */
export async function ledgerSignTransaction(
  transaction: ethers.providers.TransactionRequest
): Promise<string> {
  const tx = await ethers.utils.resolveProperties(transaction);
  const baseTx: ethers.utils.UnsignedTransaction = {
    chainId: tx.chainId || undefined,
    data: tx.data || undefined,
    gasLimit: tx.gasLimit || undefined,
    gasPrice: tx.gasPrice || undefined,
    nonce: tx.nonce ? ethers.BigNumber.from(tx.nonce).toNumber() : undefined,
    to: tx.to || undefined,
    value: tx.value || undefined,
  };

  // The following three properties are not added to the baseTx above
  // like the other properties only because this results in failure on
  // the hardhat local network.
  // @ts-ignore
  if (tx.maxFeePerGas) baseTx.maxFeePerGas = tx.maxFeePerGas;
  // @ts-ignore
  if (tx.maxPriorityFeePerGas)
    // @ts-ignore
    baseTx.maxPriorityFeePerGas = tx.maxPriorityFeePerGas;
  if (tx.type) baseTx.type = tx.type;

  const unsignedTx = ethers.utils.serializeTransaction(baseTx).substring(2);
  // @ts-ignore
  const sig = await this._retry((eth) =>
    // @ts-ignore
    eth.signTransaction(this.path, unsignedTx)
  );

  return ethers.utils.serializeTransaction(baseTx, {
    v: ethers.BigNumber.from("0x" + sig.v).toNumber(),
    r: "0x" + sig.r,
    s: "0x" + sig.s,
  });
}
