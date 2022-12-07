//SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract DeedMultiPayouts{
    address public lawyer;
    address payable public beneficiary;

    uint public earliest;

    uint public amount;
    uint constant public PAYOUTS = 10;
    uint constant public INTERVAL = 500000; //MILISECONDS
    uint public paidPayouts;

    //fromNow in seconds
    constructor(address _lawyer, address payable _beneficiary, uint fromNow) payable{
        lawyer  = _lawyer;
        beneficiary = _beneficiary;
        earliest = block.timestamp + fromNow;
        amount = msg.value / PAYOUTS;
    }

    function withdraw() public {
        require(msg.sender == lawyer, "Only lawyer allowed");        
        require(block.timestamp >= earliest, "Too early");
        require (paidPayouts < PAYOUTS, "No payouts left");

        uint elligiblePayouts = (block.timestamp - earliest) / INTERVAL;
        uint duePayouts = elligiblePayouts - paidPayouts;
        //ternary operator
        duePayouts = duePayouts + paidPayouts > PAYOUTS ? PAYOUTS - paidPayouts : duePayouts;
        paidPayouts += duePayouts;
        beneficiary.transfer(duePayouts * amount);
    }

    
    function balanceOf() public view returns (uint){
        return address(this).balance;
    }
}