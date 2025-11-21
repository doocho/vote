import { useState, useEffect } from 'react';

function PollDetails({ contract, pollId, account, onBack }) {
  const [poll, setPoll] = useState(null);
  const [dateOptions, setDateOptions] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    loadPollData();
  }, [pollId]);

  const loadPollData = async () => {
    try {
      const pollData = await contract.getPoll(pollId);
      setPoll({
        id: Number(pollData[0]),
        title: pollData[1],
        creator: pollData[2],
        createdAt: Number(pollData[3]),
        active: pollData[4],
        dateOptionsCount: Number(pollData[5])
      });

      const dateOptionsData = await contract.getAllPollDateOptions(pollId);
      setDateOptions(dateOptionsData.map(d => ({
        id: Number(d.id),
        timestamp: Number(d.timestamp),
        displayDate: d.displayDate,
        voteCount: Number(d.voteCount)
      })));

      const voterInfo = await contract.getVoterInfo(pollId, account);
      setHasVoted(voterInfo[0]);

      // Try to get winner if poll closed
      if (!pollData[4]) {
        try {
          const winnerData = await contract.getPollWinner(pollId);
          setWinner({
            id: Number(winnerData[0]),
            timestamp: Number(winnerData[1]),
            displayDate: winnerData[2],
            voteCount: Number(winnerData[3])
          });
        } catch (e) {
          console.log('No winner yet or no votes');
        }
      }
    } catch (error) {
      console.error('Error loading poll data:', error);
      alert('Error loading poll: ' + error.message);
    }
  };

  const castVote = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.vote(pollId, selectedDate);
      await tx.wait();
      alert('Vote cast successfully!');
      loadPollData();
    } catch (error) {
      console.error('Error casting vote:', error);
      alert('Error casting vote: ' + error.message);
    }
    setLoading(false);
  };

  const endPoll = async () => {
    setLoading(true);
    try {
      const tx = await contract.endPoll(pollId);
      await tx.wait();
      alert('Poll closed successfully!');
      loadPollData();
    } catch (error) {
      console.error('Error closing poll:', error);
      alert('Error closing poll: ' + error.message);
    }
    setLoading(false);
  };

  if (!poll) {
    return <div>Loading...</div>;
  }

  const isCreator = poll.creator.toLowerCase() === account.toLowerCase();
  const totalVotes = dateOptions.reduce((sum, d) => sum + d.voteCount, 0);

  return (
    <div className="poll-details">
      <button onClick={onBack} className="back-btn">← Back to All Polls</button>

      <div className="poll-header-section">
        <h2>{poll.title}</h2>
        {isCreator && <p style={{ color: '#667eea', fontWeight: 'bold' }}>You created this poll</p>}
      </div>

      <div className="poll-info-section">
        <p><strong>Created:</strong> {new Date(poll.createdAt * 1000).toLocaleString()}</p>
        <p><strong>Status:</strong> {poll.active ? 'Active - Vote Now!' : 'Closed'}</p>
        <p><strong>Total Votes:</strong> {totalVotes}</p>
      </div>

      {poll.active && !hasVoted && (
        <div className="voting-section">
          <h3>Vote for Your Preferred Date</h3>
          <form onSubmit={castVote}>
            <div className="candidates-list">
              {dateOptions.map((dateOption) => (
                <div key={dateOption.id} className="candidate-option date-option">
                  <label>
                    <input
                      type="radio"
                      name="date"
                      value={dateOption.id}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      disabled={loading}
                    />
                    <div className="date-display">
                      <span className="date-text">{dateOption.displayDate}</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            <button type="submit" disabled={loading || !selectedDate}>
              {loading ? 'Voting...' : 'Cast Vote'}
            </button>
          </form>
        </div>
      )}

      {hasVoted && poll.active && (
        <div className="poll-message voted">
          <h3>Thank You for Voting!</h3>
          <p>Your vote has been recorded. Check the results below.</p>
        </div>
      )}

      {!poll.active && (
        <div className="poll-message upcoming">
          <h3>Poll Closed</h3>
          <p>This poll is no longer accepting votes. See the final results below.</p>
        </div>
      )}

      <div className="results-section">
        <h3>Results</h3>
        {dateOptions.map((dateOption) => {
          const percentage = totalVotes > 0
            ? ((dateOption.voteCount / totalVotes) * 100).toFixed(1)
            : 0;

          return (
            <div key={dateOption.id} className="candidate-result">
              <div className="candidate-info">
                <span className="candidate-name date-name">{dateOption.displayDate}</span>
                <span className="vote-count">
                  {dateOption.voteCount} votes ({percentage}%)
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {!poll.active && winner && (
        <div className="winner-section">
          <h3>🎉 Winning Date</h3>
          <p className="winner-name">{winner.displayDate}</p>
          <p className="winner-votes">{winner.voteCount} votes</p>
        </div>
      )}

      {isCreator && poll.active && (
        <div className="creator-actions">
          <button onClick={endPoll} disabled={loading} className="danger">
            {loading ? 'Closing Poll...' : 'Close Poll'}
          </button>
        </div>
      )}
    </div>
  );
}

export default PollDetails;
