async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with account: ", deployer.address);
  console.log(
    "Account balance: ",
    hre.ethers.utils.formatEther(accountBalance)
  );

  const WavePortal = await hre.ethers.getContractFactory("WavePortal");
  const wavePortal = await WavePortal.deploy("hello Marvel");
  await wavePortal.deployed();
  console.log("wave portal deployed at", wavePortal.address);

  const AIMToken = await hre.ethers.getContractFactory("AIMToken");
  const aimToken = await AIMToken.deploy();
  await aimToken.deployed();
  console.log("Token deployed to:", aimToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
