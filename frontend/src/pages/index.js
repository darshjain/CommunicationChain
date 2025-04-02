import { useState, useEffect } from "react";
import api from "../lib/api";

export default function Home() {
    const [userAddress, setUserAddress] = useState("");
    const [myEncryptionKey, setMyEncryptionKey] = useState("");
    const [myPrivateKey, setMyPrivateKey] = useState("");

    const [receiverAddress, setReceiverAddress] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const generateKeys = () => {
        try {
            // For demonstration, random "private key" using browser's crypto
            const randArray = new Uint8Array(32);
            window.crypto.getRandomValues(randArray);
            // Convert to hex
            const privateKeyHex = Array.from(randArray, (byte) =>
                byte.toString(16).padStart(2, "0")
            ).join("");

            setMyPrivateKey(privateKeyHex);
            // Fake "public key" for PoC
            setMyEncryptionKey(`${privateKeyHex}-PUB`);
            setErrorMessage("");
        } catch (err) {
            console.error(err);
            setErrorMessage("Failed to generate keys.");
        }
    };

    const registerKey = async () => {
        try {
            setStatus("Registering key...");
            setErrorMessage("");

            const res = await api.post("/registerKey", {
                userAddress,
                publicKey: myEncryptionKey,
            });

            if (res.data.success) {
                setStatus(`Key registered. TxHash: ${res.data.txHash}`);
            } else {
                setStatus("");
                setErrorMessage("Error registering key.");
            }
        } catch (err) {
            console.error(err);
            setStatus("");
            setErrorMessage(err?.response?.data?.error || err.message);
        }
    };

    const sendEncryptedMessage = async () => {
        try {
            setStatus("Sending message...");
            setErrorMessage("");

            // Pretend we have the receiver's public key from somewhere
            const receiverPubKey = `${receiverAddress}-PUB`;

            // Some naive encryption
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
            setStatus("");
            setErrorMessage(err?.response?.data?.error || err.message);
        }
    };

    return (
        <main className="flex flex-col items-center justify-start min-h-screen bg-gray-50 py-8 px-4">
            <div className="w-full max-w-2xl bg-white shadow-md rounded p-6">
                <h1 className="text-2xl font-bold text-gray-700 mb-4">Blockchain Messaging DApp</h1>

                <div className="mb-4">
                    <label className="block text-gray-600 mb-1">Your Ethereum Address</label>
                    <input
                        type="text"
                        value={userAddress}
                        onChange={(e) => setUserAddress(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        placeholder="0xYourAddress"
                    />
                </div>

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

                <div className="mb-4">
                    <button
                        onClick={registerKey}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
                    >
                        Register My Public Key
                    </button>
                </div>

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
                    <label className="block text-gray-600 mb-1">Message</label>
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

                {/* Display status or error */}
                {status && <p className="text-green-700 mt-2">{status}</p>}
                {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
            </div>
        </main>
    );
}
