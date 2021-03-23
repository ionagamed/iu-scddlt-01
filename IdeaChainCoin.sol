// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.8.0;
pragma experimental ABIEncoderV2;

contract IdeaChainCoin {
    struct PatentPayload {
        string inventorName;
        string applicantName;
        string state;
        string addr;
        string title;
        string website;
        string country;
        string patentNumber;
        string decisionNumber;
        uint decisionDate;
        string lawNumber;
        string classificationNumber;
        string certificationAuthorityName;
    }
    
    struct Patent {
        uint id;
        address owner;
        PatentPayload payload;
    }
    
    address private admin;
    Patent[] private patents;
    
    struct UserProfile {
        string name;
        string email;
        string bio;
        bool isRegistered;
    }
    
    mapping (address => UserProfile) userProfiles;
    
    constructor () {
        admin = msg.sender;
    }
    
    function createPatent (PatentPayload memory payload) public {
        patents.push(Patent({
            id: patents.length,
            owner: msg.sender,
            payload: payload
        }));
    }
    
    function getAllPatents () public view returns (Patent[] memory) {
        return patents;
    }
    
    function getPatent (uint id) public view returns (Patent memory) {
        require(id < patents.length, 'Patent not found');
        return patents[id];
    }
    
    function transferPatent (uint id, address to) public {
        require(id < patents.length, 'Patent not found');
        require(patents[id].owner == msg.sender || admin == msg.sender, 'Only admins or owners can transfer patent ownership');
        patents[id].owner = to;
    }
    
    function registerUser (string calldata name, string calldata email, string calldata bio) public {
        userProfiles[msg.sender] = UserProfile({
            name: name,
            email: email,
            bio: bio,
            isRegistered: true
        });
    }
    
    function getUserProfile () public view returns (UserProfile memory) {
        return userProfiles[msg.sender];
    }
}
