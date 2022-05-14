import "@nomiclabs/hardhat-ethers";
import { getSigner } from "../utils/ledger-utils";
import { task } from "hardhat/config";

task("deploy-test")
  .addOptionalParam("ledgersigner")
  .setAction(async (args, hre) => {
    const signer = await getSigner(hre.ethers, Number(args.ledgersigner));
    const contractFactory = await hre.ethers.getContractFactory("TEST_PHONON");
    const contract = await contractFactory.connect(signer).deploy();
    await contract.deployed();
    console.log("PHONON ERC20 deployed to:", contract.address);

    if (hre.network.name === "localhost") {
      const accounts = await hre.ethers.getSigners();

      for (const account of accounts) {
        await contract.transfer(
          account.address,
          hre.ethers.utils.parseEther("1000")
        );
      }
    }

    await hre.run("deploy", {
      phonontokenaddress: contract.address,
      ledgersigner: args.ledgersigner,
    });
  });
