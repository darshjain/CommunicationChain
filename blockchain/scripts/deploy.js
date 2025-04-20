const hre = require("hardhat");

async function main() {
  const MessageDapp = await hre.ethers.getContractFactory("MessageDapp");
  console.log(MessageDapp)
  const messageDapp = await MessageDapp.deploy();
  //await messageDapp.deployed();
  await messageDapp.waitForDeployment(); // ✅ Proper way to wait for it to be mined

  console.log("MessageDapp deployed to:", messageDapp.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
