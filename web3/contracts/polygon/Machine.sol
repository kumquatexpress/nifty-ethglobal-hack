// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./MintToken.sol";

contract Machine {
    using SafeMath for uint256;
    address public owner = msg.sender;

    event Create(address indexed configAddress, address indexed sender);

    function create(
        string memory _name,
        string memory _symbol,
        uint256 _priceWei,
        uint256 _startTime,
        address payable[] memory _creators,
        uint256[] memory _amounts,
        uint256[] memory _percentages
    ) public returns (address configAddress) {
        address config = address(
            new MintToken(
                _name,
                _symbol,
                _priceWei,
                _startTime,
                msg.sender,
                _creators,
                _amounts,
                _percentages
            )
        );
        emit Create(config, msg.sender);
        return config;
    }
}
