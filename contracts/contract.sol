// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.19;

contract RecordTracker {
    struct Record {
        string ipfsCid;
        string latitude;
        string longitude;
        string recordType;
        uint256 timestamp;
        bool isDeleted; 
        uint8 rating;
    }

    mapping(address => Record[]) private userRecords;
    Record[] private allRecords;

    event RecordAdded(address indexed user, string ipfsCid, string latitude, string longitude, string recordType, uint256 timestamp);
    event RecordDeleted(address indexed user, uint256 indexed recordIndex);
    event RecordRestored(address indexed user, uint256 indexed recordIndex);

    function addRecord(string memory _ipfsCid, string memory _latitude, string memory _longitude, string memory _recordType, uint8 _rating) public {
        require(_rating >= 1 && _rating <= 5, "rating must be between 1 and 5");
        Record memory newRecord = Record(_ipfsCid, _latitude, _longitude, _recordType, block.timestamp, false, _rating);
        allRecords.push(newRecord);
        emit RecordAdded(msg.sender, _ipfsCid, _latitude, _longitude, _recordType, block.timestamp);
    }

    function deleteRecord(uint256 _index) public {
        require(_index < userRecords[msg.sender].length, "Invalid record index");
        require(!userRecords[msg.sender][_index].isDeleted, "Record already deleted");
        userRecords[msg.sender][_index].isDeleted = true;
        emit RecordDeleted(msg.sender, _index);
    }

    function restoreRecord(uint256 _index) public {
        require(_index < userRecords[msg.sender].length, "Invalid record index");
        require(userRecords[msg.sender][_index].isDeleted, "Record is not deleted");
        userRecords[msg.sender][_index].isDeleted = false;
        emit RecordRestored(msg.sender, _index);
    }

    function getUserRecords(address _user) public view returns (Record[] memory) {
        Record[] memory allUserRecords = userRecords[_user];
        uint256 activeRecordCount = 0;

        for (uint256 i = 0; i < allUserRecords.length; i++) {
            if (!allUserRecords[i].isDeleted) {
                activeRecordCount++;
            }
        }

        Record[] memory activeRecords = new Record[](activeRecordCount);
        uint256 index = 0;

        for (uint256 i = 0; i < allUserRecords.length; i++) {
            if (!allUserRecords[i].isDeleted) {
                activeRecords[index] = allUserRecords[i];
                index++;
            }
        }

        return activeRecords;
    }

    function getAllRecords() public view returns (Record[] memory) {
        uint256 activeRecordCount = 0;

        for (uint256 i = 0; i < allRecords.length; i++) {
            if (!allRecords[i].isDeleted) {
                activeRecordCount++;
            }
        }

        Record[] memory activeRecords = new Record[](activeRecordCount);
        uint256 index = 0;

        for (uint256 i = 0; i < allRecords.length; i++) {
            if (!allRecords[i].isDeleted) {
                activeRecords[index] = allRecords[i];
                index++;
            }
        }

        return activeRecords;
    }

    function getUserRecordCount(address _user) public view returns (uint256) {
        return userRecords[_user].length;
    }

    function getTotalRecordCount() public view returns (uint256) {
        return allRecords.length;
    }
}