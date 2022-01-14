pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import {Base64} from "../libraries/Base64.sol";

contract MintToken is ERC721URIStorage {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    Counters.Counter private _tokenIds;

    address payable public owner;

    uint256 public startTime;
    uint256 public priceWei;

    string[] public candidates;

    error Unauthorized();
    error TooEarly();
    error TooLate();
    error Empty();
    event Mint(uint256 tokenId, string url, address indexed sender);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _priceWei,
        uint256 _startTime,
        address _owner
    ) ERC721(_name, _symbol) {
        startTime = _startTime;
        candidates = new string[](0);
        owner = payable(_owner);
        priceWei = _priceWei;
    }

    modifier onlyBy(address _account) {
        if (msg.sender != _account) revert Unauthorized();
        _;
    }

    modifier onlyAfter(uint256 _time) {
        if (block.timestamp < _time) revert TooEarly();
        _;
    }

    modifier onlyBefore(uint256 _time) {
        if (block.timestamp > _time) revert TooLate();
        _;
    }

    // Does this work?
    function addBatch(string[] calldata _candidates)
        public
        onlyBy(owner)
        onlyBefore(startTime)
    {
        for (uint256 i = 0; i < _candidates.length; i += 1) {
            candidates.push(_candidates[i]);
        }
    }

    // Some randomness but pretty deterministic
    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(abi.encodePacked(block.difficulty, block.timestamp))
            );
    }

    function getTotalMined() public view returns (uint256) {
        return _tokenIds.current();
    }
}
