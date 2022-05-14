import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";

task("set-local-network-time")
  .addParam("timestamp")
  .setAction(async (args, hre) => {
    await hre.network.provider.send("evm_setNextBlockTimestamp", [
      Number(args.timestamp),
    ]);
    await hre.network.provider.send("evm_mine");
  });
