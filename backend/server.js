require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();
app.use(cors());
app.use(express.json());

// Load environment variables
const PRIVATE_KEY = process.env.SPONSOR_PRIVATE_KEY;
const PROVIDER_URL = process.env.PROVIDER_URL; // e.g. Alchemy or Infura

// Configure provider and wallet
const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// ABI & contract address from your deploy step
const contractABI = [
    // Only the needed function fragments or the entire contract ABI
    // e.g.:
    "function registerEncryptionKey(string _publicKey) external",
    "function sendMessage(address _receiver, string _cipherText) external",
    "function encryptionPublicKeys(address) view returns (string)",
    // etc...
];
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Example route: relay registerEncryptionKey
app.post('/registerKey', async (req, res) => {
    try {
        const { userAddress, publicKey } = req.body;
        // Here, you'd normally verify that the request is signed by `userAddress`.
        // For a simple PoC, you might skip verification.

        // Make the contract call from the sponsor wallet
        const tx = await contract.registerEncryptionKey(publicKey);
        const receipt = await tx.wait();

        res.json({ success: true, txHash: receipt.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Example route: relay sendMessage
app.post('/sendMessage', async (req, res) => {
    try {
        const { sender, receiver, cipherText } = req.body;
        // Similarly, you might verify the request is from `sender`.

        const tx = await contract.sendMessage(receiver, cipherText);
        const receipt = await tx.wait();

        res.json({ success: true, txHash: receipt.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post("/getUserMessages", async (req, res) => {
    try {
        const { userAddress } = req.body;
        // Call the contract function
        // Example: const messages = await contract.getUserMessages(userAddress);

        const messages = await contract.getUserMessages(userAddress);
        res.json({ success: true, messages });
    } catch (error) {
        console.error("getUserMessages error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});


app.listen(3001, () => {
    console.log('Backend listening on port 3001');
});

