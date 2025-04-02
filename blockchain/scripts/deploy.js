const hre = require("hardhat");

async function main() {
    const MessageDapp = await hre.ethers.getContractFactory("MessageDapp");
    const messageDapp = await MessageDapp.deploy();
    await messageDapp.deployed();

    console.log("MessageDapp deployed to:", messageDapp.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
