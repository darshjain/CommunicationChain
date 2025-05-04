
import "dotenv/config"; 
import express from "express";
import cors from "cors";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ABI = JSON.parse(fs.readFileSync(path.join(__dirname, "abi.json")));


const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);
const wallet = new ethers.Wallet(process.env.SPONSOR_PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, wallet);


const app = express();
app.use(cors());
app.use(express.json());


async function relayTx(res, fn) {
  try {
    const tx = await fn(); 
    const receipt = await tx.wait();
    return res.json({ success: true, txHash: receipt.transactionHash });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
}


app.post("/registerKey", async (req, res) => {
  const { userAddress, publicKey } = req.body;
  if (!userAddress || !publicKey)
    return res.status(400).json({ success: false, error: "Missing params" });

  
  await relayTx(res, () => contract.registerEncryptionKey(publicKey));
});


app.post("/sendMessage", async (req, res) => {
  const { sender, receiver, cipherText } = req.body;
  if (!sender || !receiver || !cipherText)
    return res.status(400).json({ success: false, error: "Missing params" });

  await relayTx(res, () => contract.sendMessage(receiver, cipherText));
});


app.post("/getUserMessages", async (req, res) => {
  try {
    const { userAddress } = req.body;
    if (!userAddress)
      return res
        .status(400)
        .json({ success: false, error: "Missing userAddress" });

    
    const rawMessages = await contract.getUserMessages(userAddress);

    
    const messages = rawMessages.map(m => ({
      sender: m.sender,
      receiver: m.receiver,
      cipherText: m.cipherText,
      
      timestamp: m.timestamp.toString()      
      
    }));

    res.json({ success: true, messages });
    console.log("Messages:", messages);
  } catch (err) {
    console.error("getUserMessages error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Relayer backend running on :${PORT}`));
