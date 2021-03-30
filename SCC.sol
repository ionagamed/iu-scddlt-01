// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract SCC {
    address payable public admin_address;
    mapping(address => uint32) public balances;
    int32 supply;
    uint fee = 343000000000000;
    
    constructor(address payable owner) {
        admin_address = owner;
        supply = 10000000;
    }
    
    function generateToken(int32 meters) public {
        require(supply > 0, "Supply must be positive");
        
        if (meters <= 30) {
            supply -= 1;
            balances[msg.sender] += 1;
        }
    }
    
    function sendTokens(address to, uint32 amount) public payable {
        require(balances[msg.sender] >= amount, "Must be not poor lol");
        require(msg.value == fee, "Tx fee 0.000343 ETH");
        
        balances[to] += amount;
        balances[msg.sender] -= amount;
    }
    
    function withdraw() public {
        require(msg.sender == admin_address, "Must be owner");
        admin_address.transfer(address(this).balance);
    }
}

