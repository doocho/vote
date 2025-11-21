// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Voting {
    struct DateOption {
        uint256 id;
        uint256 timestamp; // Unix timestamp of the date
        string displayDate; // Human readable date string
        uint256 voteCount;
    }

    struct Voter {
        bool hasVoted;
        uint256 votedDateId;
    }

    struct Poll {
        uint256 id;
        string title;
        address creator;
        uint256 createdAt;
        bool active;
        mapping(uint256 => DateOption) dateOptions;
        mapping(address => Voter) voters;
        uint256 dateOptionsCount;
    }

    mapping(uint256 => Poll) public polls;
    uint256 public pollsCount;

    event PollCreated(uint256 indexed pollId, string title, address indexed creator);
    event DateOptionAdded(uint256 indexed pollId, uint256 indexed dateId, string displayDate);
    event VoteCast(uint256 indexed pollId, address indexed voter, uint256 indexed dateId);
    event PollEnded(uint256 indexed pollId);

    function createPoll(
        string memory _title,
        uint256[] memory _timestamps,
        string[] memory _displayDates
    ) public returns (uint256) {
        require(bytes(_title).length > 0, "Poll title cannot be empty");
        require(_timestamps.length > 0, "Must have at least one date option");
        require(_timestamps.length == _displayDates.length, "Timestamps and display dates length mismatch");

        pollsCount++;
        Poll storage newPoll = polls[pollsCount];

        newPoll.id = pollsCount;
        newPoll.title = _title;
        newPoll.creator = msg.sender;
        newPoll.createdAt = block.timestamp;
        newPoll.active = true;
        newPoll.dateOptionsCount = 0;

        // Add all date options
        for (uint256 i = 0; i < _timestamps.length; i++) {
            require(bytes(_displayDates[i]).length > 0, "Display date cannot be empty");
            newPoll.dateOptionsCount++;
            newPoll.dateOptions[newPoll.dateOptionsCount] = DateOption(
                newPoll.dateOptionsCount,
                _timestamps[i],
                _displayDates[i],
                0
            );
            emit DateOptionAdded(pollsCount, newPoll.dateOptionsCount, _displayDates[i]);
        }

        emit PollCreated(pollsCount, _title, msg.sender);

        return pollsCount;
    }

    function vote(uint256 _pollId, uint256 _dateId) public {
        require(_pollId > 0 && _pollId <= pollsCount, "Invalid poll ID");
        Poll storage poll = polls[_pollId];

        require(poll.active, "Poll is not active");
        require(!poll.voters[msg.sender].hasVoted, "You have already voted");
        require(_dateId > 0 && _dateId <= poll.dateOptionsCount, "Invalid date option ID");

        poll.voters[msg.sender].hasVoted = true;
        poll.voters[msg.sender].votedDateId = _dateId;
        poll.dateOptions[_dateId].voteCount++;

        emit VoteCast(_pollId, msg.sender, _dateId);
    }

    function endPoll(uint256 _pollId) public {
        require(_pollId > 0 && _pollId <= pollsCount, "Invalid poll ID");
        Poll storage poll = polls[_pollId];

        require(poll.creator == msg.sender, "Only poll creator can end the poll");
        require(poll.active, "Poll is not active");

        poll.active = false;

        emit PollEnded(_pollId);
    }

    function getPoll(uint256 _pollId) public view returns (
        uint256 id,
        string memory title,
        address creator,
        uint256 createdAt,
        bool active,
        uint256 dateOptionsCount
    ) {
        require(_pollId > 0 && _pollId <= pollsCount, "Invalid poll ID");
        Poll storage poll = polls[_pollId];

        return (
            poll.id,
            poll.title,
            poll.creator,
            poll.createdAt,
            poll.active,
            poll.dateOptionsCount
        );
    }

    function getPollDateOption(uint256 _pollId, uint256 _dateId) public view returns (
        uint256 id,
        uint256 timestamp,
        string memory displayDate,
        uint256 voteCount
    ) {
        require(_pollId > 0 && _pollId <= pollsCount, "Invalid poll ID");
        Poll storage poll = polls[_pollId];
        require(_dateId > 0 && _dateId <= poll.dateOptionsCount, "Invalid date option ID");

        DateOption memory dateOption = poll.dateOptions[_dateId];
        return (dateOption.id, dateOption.timestamp, dateOption.displayDate, dateOption.voteCount);
    }

    function getAllPollDateOptions(uint256 _pollId) public view returns (DateOption[] memory) {
        require(_pollId > 0 && _pollId <= pollsCount, "Invalid poll ID");
        Poll storage poll = polls[_pollId];

        DateOption[] memory allDateOptions = new DateOption[](poll.dateOptionsCount);

        for (uint256 i = 1; i <= poll.dateOptionsCount; i++) {
            allDateOptions[i - 1] = poll.dateOptions[i];
        }

        return allDateOptions;
    }

    function getVoterInfo(uint256 _pollId, address _voter) public view returns (bool hasVoted, uint256 votedDateId) {
        require(_pollId > 0 && _pollId <= pollsCount, "Invalid poll ID");
        Poll storage poll = polls[_pollId];
        Voter memory voter = poll.voters[_voter];
        return (voter.hasVoted, voter.votedDateId);
    }

    function getPollWinner(uint256 _pollId) public view returns (uint256, uint256, string memory, uint256) {
        require(_pollId > 0 && _pollId <= pollsCount, "Invalid poll ID");
        Poll storage poll = polls[_pollId];
        require(poll.dateOptionsCount > 0, "No date options available");

        uint256 winningVoteCount = 0;
        uint256 winningDateId = 0;

        for (uint256 i = 1; i <= poll.dateOptionsCount; i++) {
            if (poll.dateOptions[i].voteCount > winningVoteCount) {
                winningVoteCount = poll.dateOptions[i].voteCount;
                winningDateId = i;
            }
        }

        require(winningDateId > 0, "No votes cast yet");
        DateOption memory winner = poll.dateOptions[winningDateId];
        return (winner.id, winner.timestamp, winner.displayDate, winner.voteCount);
    }

    function getAllPolls() public view returns (
        uint256[] memory ids,
        string[] memory titles,
        address[] memory creators,
        uint256[] memory createdAts,
        bool[] memory actives
    ) {
        ids = new uint256[](pollsCount);
        titles = new string[](pollsCount);
        creators = new address[](pollsCount);
        createdAts = new uint256[](pollsCount);
        actives = new bool[](pollsCount);

        for (uint256 i = 1; i <= pollsCount; i++) {
            Poll storage poll = polls[i];
            ids[i - 1] = poll.id;
            titles[i - 1] = poll.title;
            creators[i - 1] = poll.creator;
            createdAts[i - 1] = poll.createdAt;
            actives[i - 1] = poll.active;
        }

        return (ids, titles, creators, createdAts, actives);
    }
}
