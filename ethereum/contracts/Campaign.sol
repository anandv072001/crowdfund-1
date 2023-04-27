/// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    uint numRequests;
    mapping (uint => Request) requests;
    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    uint256 public approversCount;

    modifier restricted() {
        require(msg.sender == manager, "Only the manager can call this function.");
        _;
    }

    modifier onlyContributor() {
    require(approvers[msg.sender], "Only contributors can call this function.");
    _;
}


    constructor(uint256 minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution, "Amount sent is below the minimum contribution required.");

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory description, uint value, address recipient) public restricted {            
        Request storage r = requests[numRequests++];
        r.description = description;
        r.value = value;
        r.recipient = payable(recipient);
        r.complete = false;
        r.approvalCount = 0;
    }

    function getRequest(uint index) public view returns (string memory description, uint256 value, address payable recipient, bool complete, uint256 approvalCount) {
    require(index < numRequests, "Index out of range.");
    Request storage r = requests[index];
    return (r.description, r.value, r.recipient, r.complete, r.approvalCount);
}


    function approveRequest(uint256 index) public onlyContributor {
    Request storage request = requests[index];
    require(!request.approvals[msg.sender], "Contributor has already approved this request.");

    request.approvals[msg.sender] = true;
    request.approvalCount++;
}

    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2), "Not enough approvals to finalize request.");
        require(!request.complete, "Request has already been completed.");

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (
        uint256, uint256, uint256, uint256, address
    ) {
        return (
            minimumContribution,
            address(this).balance,
            numRequests,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return  numRequests;
    }
}


