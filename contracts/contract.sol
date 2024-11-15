// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.19;

contract RecordTracker {
    struct Record {
        string ipfsCid;
        uint256 timestamp;
    }

    mapping(address => Record[]) private userRecords;
    Record[] private allRecords;

    event RecordAdded(address indexed user, string ipfsCid, uint256 timestamp);

    function addRecord(string memory _ipfsCid) public {
        Record memory newRecord = Record(_ipfsCid, block.timestamp);
        userRecords[msg.sender].push(newRecord);
        allRecords.push(newRecord);
        emit RecordAdded(msg.sender, _ipfsCid, block.timestamp);
    }

    function getUserRecords(address _user) public view returns (Record[] memory) {
        return userRecords[_user];
    }

    function getAllRecords() public view returns (Record[] memory) {
        return allRecords;
    }

    function getUserRecordCount(address _user) public view returns (uint256) {
        return userRecords[_user].length;
    }

    function getTotalRecordCount() public view returns (uint256) {
        return allRecords.length;
    }
}