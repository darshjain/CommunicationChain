// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MessageDapp {
    // Each user (Ethereum address) will register a separate public key used for encryption
    mapping(address => string) public encryptionPublicKeys;

    // Struct to store message details
    struct EncryptedMessage {
        address sender;
        address receiver;
        string cipherText;    // The encrypted text
        uint256 timestamp;
    }

    // We'll store messages in an array. In production, you'd probably use event logs or IPFS
    EncryptedMessage[] private messages;

    // Event for new messages (so we can fetch via thegraph or even from the contract logs)
    event MessageSent(
        address indexed sender,
        address indexed receiver,
        uint256 indexed messageIndex,
        string cipherText
    );

    // Register or update encryption public key for the caller
    function registerEncryptionKey(string calldata _publicKey) external {
        encryptionPublicKeys[msg.sender] = _publicKey;
    }

    // Send an encrypted message
    function sendMessage(address _receiver, string calldata _cipherText) external {
        // Must have a public key set to send messages
        require(bytes(encryptionPublicKeys[msg.sender]).length > 0, "Sender has no public key registered");
        // The receiver must have a public key
        require(bytes(encryptionPublicKeys[_receiver]).length > 0, "Receiver has no public key registered");

        messages.push(EncryptedMessage({
            sender: msg.sender,
            receiver: _receiver,
            cipherText: _cipherText,
            timestamp: block.timestamp
        }));

        emit MessageSent(msg.sender, _receiver, messages.length - 1, _cipherText);
    }

    // Retrieve message info by index
    function getMessage(uint256 _index) external view returns (
        address sender,
        address receiver,
        string memory cipherText,
        uint256 timestamp
    ) {
        EncryptedMessage storage message = messages[_index];
        return (
            message.sender,
            message.receiver,
            message.cipherText,
            message.timestamp
        );
    }

    // Retrieve total message count
    function getMessageCount() external view returns (uint256) {
        return messages.length;
    }

    // Retrieve all messages relevant for a given user
    function getUserMessages(address _user) external view returns (EncryptedMessage[] memory) {
        // Not recommended in a real large-scale scenario to return all messages from chain
        // But for your PoC, we’ll do it simply.
        uint256 totalCount = messages.length;
        uint256 count = 0;

        // Count how many are relevant
        for (uint256 i = 0; i < totalCount; i++) {
            if (messages[i].sender == _user || messages[i].receiver == _user) {
                count++;
            }
        }

        // Build a filtered array
        EncryptedMessage[] memory result = new EncryptedMessage[](count);
        uint256 j = 0;
        for (uint256 i = 0; i < totalCount; i++) {
            if (messages[i].sender == _user || messages[i].receiver == _user) {
                result[j] = messages[i];
                j++;
            }
        }

        return result;
    }
}
