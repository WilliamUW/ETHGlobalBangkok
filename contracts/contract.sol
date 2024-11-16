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

    // Constructor to populate records
    constructor() {
        // Record 1
        addRecord("Mj9_8Ur5mF4cYuIrp859BYL1buCLVab7SBv3u6Y8FUo", "13.728466", "100.557417", "Water Fountain", 5);
        addRecord("Mj9_8Ur5mF4cYuIrp859BYL1buCLVab7SBv3u6Y8FUo", "13.724275", "100.557290", "Water Fountain", 5);
        addRecord("Mj9_8Ur5mF4cYuIrp859BYL1buCLVab7SBv3u6Y8FUo", "13.732884", "100.557723", "Water Fountain", 5);

        // Record 2
        addRecord("46HHZ93EZS1idcAx7GK3fZAMtxAIimgySvTDg2FFpdg", "13.731741", "100.553842", "Restroom", 4);
        addRecord("46HHZ93EZS1idcAx7GK3fZAMtxAIimgySvTDg2FFpdg", "13.732540", "100.557917", "Restroom", 4);
        addRecord("46HHZ93EZS1idcAx7GK3fZAMtxAIimgySvTDg2FFpdg", "13.728210", "100.553471", "Restroom", 4);

        // Record 3
        addRecord("gomk6MTxtXVdUKYz9gdHcbP8ov2eBC5FL2PSpupfuVE", "13.729512", "100.555817", "Restroom", 5);
        addRecord("gomk6MTxtXVdUKYz9gdHcbP8ov2eBC5FL2PSpupfuVE", "13.727810", "100.554217", "Restroom", 5);
        addRecord("gomk6MTxtXVdUKYz9gdHcbP8ov2eBC5FL2PSpupfuVE", "13.733102", "100.558172", "Restroom", 5);

        // Record 4
        addRecord("n6p0dhFyYc4V2U209DVKzTNsdJSf9yt-bc3G8M57gRM", "13.726875", "100.557612", "Restroom", 5);
        addRecord("n6p0dhFyYc4V2U209DVKzTNsdJSf9yt-bc3G8M57gRM", "13.728953", "100.557237", "Restroom", 5);
        addRecord("n6p0dhFyYc4V2U209DVKzTNsdJSf9yt-bc3G8M57gRM", "13.731432", "100.552331", "Restroom", 5);

        // Record 5
        addRecord("WTMe35gA3u-eetIvzXgHFZ3sWdm_-vx8UDXSFdLawjY", "13.729811", "100.556234", "Water Fountain", 5);
        addRecord("WTMe35gA3u-eetIvzXgHFZ3sWdm_-vx8UDXSFdLawjY", "13.726412", "100.554892", "Water Fountain", 5);
        addRecord("WTMe35gA3u-eetIvzXgHFZ3sWdm_-vx8UDXSFdLawjY", "13.732103", "100.555678", "Water Fountain", 5);

        // Record 6
        addRecord("gw8XmacxZ46J1wpvcb7FiHso-C6IF4MUrblRPV2_lFU", "13.728932", "100.557120", "Water Fountain", 3);
        addRecord("gw8XmacxZ46J1wpvcb7FiHso-C6IF4MUrblRPV2_lFU", "13.729452", "100.555200", "Water Fountain", 3);
        addRecord("gw8XmacxZ46J1wpvcb7FiHso-C6IF4MUrblRPV2_lFU", "13.726543", "100.558913", "Water Fountain", 3);

        // Record 7
        addRecord("LzPb2lam7DyndL2GjEFZYn9LQ0qM6wbTBC4psKiQLxw", "13.729112", "100.554842", "Water Fountain", 4);
        addRecord("LzPb2lam7DyndL2GjEFZYn9LQ0qM6wbTBC4psKiQLxw", "13.731321", "100.557984", "Water Fountain", 4);
        addRecord("LzPb2lam7DyndL2GjEFZYn9LQ0qM6wbTBC4psKiQLxw", "13.727312", "100.556532", "Water Fountain", 4);

        // Record 8
        addRecord("3xAOylJbhS9ctwGnEmsXfvEmSYCsTDU94M6rROPwjEA", "13.732451", "100.553213", "Water Fountain", 2);
        addRecord("3xAOylJbhS9ctwGnEmsXfvEmSYCsTDU94M6rROPwjEA", "13.725841", "100.556748", "Water Fountain", 2);
        addRecord("3xAOylJbhS9ctwGnEmsXfvEmSYCsTDU94M6rROPwjEA", "13.728541", "100.554121", "Water Fountain", 2);

        // Record 9
        addRecord("VduPzrl1cSQIgvJQBhWy7dpKQjnxjq2YpAs2tLLzTFs", "13.729412", "100.552789", "Water Fountain", 4);
        addRecord("VduPzrl1cSQIgvJQBhWy7dpKQjnxjq2YpAs2tLLzTFs", "13.732512", "100.558313", "Water Fountain", 4);
        addRecord("VduPzrl1cSQIgvJQBhWy7dpKQjnxjq2YpAs2tLLzTFs", "13.727512", "100.556431", "Water Fountain", 4);

        // Record 10
        addRecord("lv0-JjqJPv3iMy0--3jEQ1FyT4m5K4an8VdGOe8bkUM", "13.726932", "100.554321", "Water Fountain", 5);
        addRecord("lv0-JjqJPv3iMy0--3jEQ1FyT4m5K4an8VdGOe8bkUM", "13.731243", "100.553875", "Water Fountain", 5);
        addRecord("lv0-JjqJPv3iMy0--3jEQ1FyT4m5K4an8VdGOe8bkUM", "13.729831", "100.556721", "Water Fountain", 5);
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