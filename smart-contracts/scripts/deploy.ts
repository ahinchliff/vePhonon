import "@nomiclabs/hardhat-ethers";
import { getSigner } from "../utils/ledger-utils";
import config from "../config/config";
import { task } from "hardhat/config";

task("deploy")
  .addParam("phonontokenaddress")
  .addOptionalParam("ledgersigner")
  .addOptionalParam("gaspriceingwei")
  .setAction(async (args, hre) => {
    const networkName = hre.network.name;

    const signer = await getSigner(hre.ethers, Number(args.ledgersigner));

    console.table({
      network: networkName,
      signer: await signer.getAddress(),
      phononTokenAddress: args.phonontokenaddress,
      gasPrice: `${args.gaspriceingwei} GWEI`,
    });

    if (networkName !== "localhost") {
      console.log("Deploying in 20 seconds unless cancelled");
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 20000);
      });
    }

    const vePhononFactory = await hre.ethers.getContractFactory("vePhonon");
    const vePhonon = await vePhononFactory
      .connect(signer)
      .deploy(
        args.phonontokenaddress,
        config.vePhononTokenName,
        config.vePhononTokenSymbol,
        config.vePhononContractVersion,
        {
          gasPrice: args.gaspriceingwei
            ? hre.ethers.utils
                .parseUnits(args.gaspriceingwei, "gwei")
                .toString()
            : undefined,
        }
      );

    await vePhonon.deployed();

    console.log("vePhonon deployed to:", vePhonon.address);
  });
