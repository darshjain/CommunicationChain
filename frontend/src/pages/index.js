import { useState } from "react";
import api from "../lib/api";

export default function Home() {
    const [userAddress, setUserAddress] = useState("");

    const [myPrivateKey, setMyPrivateKey] = useState("");
    const [myEncryptionKey, setMyEncryptionKey] = useState("");

    const [receiverAddress, setReceiverAddress] = useState("");
    const [message, setMessage] = useState("");

    // For displaying message history
    const [messagesList, setMessagesList] = useState([]);

    // Status & Error
    const [status, setStatus] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // 1. Generate key pair (dummy demonstration)
    const generateKeys = () => {
        try {
            setErrorMessage("");
            setStatus("Generating keys...");

            const randArray = new Uint8Array(32);
            window.crypto.getRandomValues(randArray);
            const privateKeyHex = Array.from(randArray, (b) =>
                b.toString(16).padStart(2, "0")
            ).join("");

            setMyPrivateKey(privateKeyHex);
            setMyEncryptionKey(`${privateKeyHex}-PUB`); // naive "public key"
            setStatus("Keys generated successfully.");
        } catch (err) {
            console.error(err);
            setErrorMessage("Failed to generate keys.");
            setStatus("");
        }
    };

    // 2. Register public key via backend (which relays to contract)
    const registerKey = async () => {
        try {
            setErrorMessage("");
            setStatus("Registering key...");

            const res = await api.post("/registerKey", {
                userAddress,
                publicKey: myEncryptionKey,
            });

            if (res.data.success) {
                setStatus(`Key registered. TxHash: ${res.data.txHash}`);
            } else {
                setStatus("");
                setErrorMessage("Error registering key on the contract.");
            }
        } catch (err) {
            console.error(err);
            setErrorMessage(err.response?.data?.error || err.message);
            setStatus("");
        }
    };

    // 3. Send an encrypted message
    const sendEncryptedMessage = async () => {
        try {
            setErrorMessage("");
            setStatus("Sending message...");

            // For demonstration, let's pretend we have the receiver's pubkey
            const receiverPubKey = `${receiverAddress}-PUB`;
            const cipherText = `ENCRYPTED(${message})WITH(${receiverPubKey})`;

            const res = await api.post("/sendMessage", {
                sender: userAddress,
                receiver: receiverAddress,
                cipherText,
            });

            if (res.data.success) {
                setStatus(`Message sent. TxHash: ${res.data.txHash}`);
            } else {
                setStatus("");
                setErrorMessage("Error sending message.");
            }
        } catch (err) {
            console.error(err);
            setErrorMessage(err.response?.data?.error || err.message);
            setStatus("");
        }
    };

    // 4. Load message history for this user
    const loadMessages = async () => {
        try {
            setErrorMessage("");
            setStatus("Loading messages...");

            const res = await api.post("/getUserMessages", {
                userAddress,
            });

            if (res.data.success) {
                console.log(res.data.messages);
                setMessagesList(res.data.messages);
                setStatus(`Loaded ${res.data.messages.length} messages.`);
            } else {
                setStatus("");
                setErrorMessage("Failed to load messages.");
            }
        } catch (err) {
            console.error(err);
            setErrorMessage(err.response?.data?.error || err.message);
            setStatus("");
        }
    };

    return (
        <main className="flex flex-col items-center min-h-screen bg-gray-50 py-8 px-4">
            <div className="w-full max-w-3xl bg-white shadow-md rounded p-6">
                <h1 className="text-2xl font-bold text-gray-700 mb-4">
                    Blockchain Messaging DApp
                </h1>

                {/* USER ADDRESS */}
                <div className="mb-4">
                    <label className="block text-gray-600 mb-1">Your Ethereum Address</label>
                    <input
                        type="text"
                        value={userAddress}
                        onChange={(e) => setUserAddress(e.target.value)}
                        placeholder="0xYourAddress"
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                </div>

                {/* GENERATE KEYS */}
                <div className="mb-4">
                    <button
                        onClick={generateKeys}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                    >
                        Generate Encryption Keys
                    </button>
                    {myPrivateKey && (
                        <div className="mt-2 text-sm text-gray-600">
                            <p>Private Key: {myPrivateKey}</p>
                            <p>Public Key: {myEncryptionKey}</p>
                        </div>
                    )}
                </div>

                {/* REGISTER KEY */}
                <div className="mb-4">
                    <button
                        onClick={registerKey}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
                    >
                        Register My Public Key
                    </button>
                </div>

                {/* RECEIVER & MESSAGE */}
                <hr className="my-4" />
                <div className="mb-4">
                    <label className="block text-gray-600 mb-1">Receiver Address</label>
                    <input
                        type="text"
                        value={receiverAddress}
                        onChange={(e) => setReceiverAddress(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-600 mb-1">Your Message</label>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                </div>

                <div className="mb-4">
                    <button
                        onClick={sendEncryptedMessage}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500"
                    >
                        Send Encrypted Message
                    </button>
                </div>

                {/* LOAD MESSAGES */}
                <div className="mb-4">
                    <button
                        onClick={loadMessages}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
                    >
                        Load My Messages
                    </button>
                </div>

                {/* STATUS / ERROR */}
                {status && <p className="text-green-700 font-semibold mb-2">{status}</p>}
                {errorMessage && <p className="text-red-600 font-semibold mb-2">{errorMessage}</p>}

                {/* MESSAGE HISTORY LIST */}
                <div className="max-h-96 overflow-auto border-t mt-4 pt-4">
                    {messagesList.length > 0 ? (
                        messagesList.map((msg, idx) => (
                            <div key={idx} className="border-b mb-4 pb-2">
                                <p className="text-sm text-gray-700">
                                    <span className="font-bold">From:</span> {msg.sender}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <span className="font-bold">To:</span> {msg.receiver}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <span className="font-bold">Encrypted:</span> {msg.cipherText}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {new Date(msg.timestamp * 1000).toLocaleString()}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No messages loaded yet.</p>
                    )}
                </div>
            </div>
        </main>
    );
}
