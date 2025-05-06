// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MessageDapp {
    mapping(address => string) public encryptionPublicKeys;

    struct EncryptedMessage {
        address sender;
        address receiver;
        string cipherText;
        uint256 timestamp;
    }

    EncryptedMessage[] private messages;

    event MessageSent(
        address indexed sender,
        address indexed receiver,
        uint256 indexed messageIndex,
        string cipherText
    );

    function registerEncryptionKey(string calldata _publicKey) external {
        encryptionPublicKeys[msg.sender] = _publicKey;
    }
    function sendMessage(
        address _receiver,
        string calldata _cipherText
    ) external {
        require(
            bytes(encryptionPublicKeys[msg.sender]).length > 0,
            "Sender has no public key registered"
        );
        require(
            bytes(encryptionPublicKeys[_receiver]).length > 0,
            "Receiver has no public key registered"
        );

        messages.push(
            EncryptedMessage({
                sender: msg.sender,
                receiver: _receiver,
                cipherText: _cipherText,
                timestamp: block.timestamp
            })
        );

        emit MessageSent(
            msg.sender,
            _receiver,
            messages.length - 1,
            _cipherText
        );
    }
    function getMessage(
        uint256 _index
    )
        external
        view
        returns (
            address sender,
            address receiver,
            string memory cipherText,
            uint256 timestamp
        )
    {
        EncryptedMessage storage message = messages[_index];
        return (
            message.sender,
            message.receiver,
            message.cipherText,
            message.timestamp
        );
    }

    function getMessageCount() external view returns (uint256) {
        return messages.length;
    }

    function getUserMessages(
        address _user
    ) external view returns (EncryptedMessage[] memory) {
        uint256 totalCount = messages.length;
        uint256 count = 0;

        for (uint256 i = 0; i < totalCount; i++) {
            if (messages[i].sender == _user || messages[i].receiver == _user) {
                count++;
            }
        }
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
