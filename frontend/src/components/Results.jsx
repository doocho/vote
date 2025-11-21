import { useState, useEffect } from 'react';

function Results({ candidates, votingStatus, contract }) {
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (candidates.length > 0 && !votingStatus.active) {
      loadWinner();
    }
  }, [candidates, votingStatus]);

  const loadWinner = async () => {
    try {
      const winnerData = await contract.getWinner();
      setWinner({
        id: Number(winnerData[0]),
        name: winnerData[1],
        voteCount: Number(winnerData[2])
      });
    } catch (error) {
      console.error('Error loading winner:', error);
    }
  };

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

  return (
    <div className="results">
      <h2>Results</h2>

      {candidates.length === 0 ? (
        <p>No candidates yet</p>
      ) : (
        <>
          <div className="candidates-results">
            {candidates.map((candidate) => {
              const percentage = totalVotes > 0
                ? ((candidate.voteCount / totalVotes) * 100).toFixed(1)
                : 0;

              return (
                <div key={candidate.id} className="candidate-result">
                  <div className="candidate-info">
                    <span className="candidate-name">{candidate.name}</span>
                    <span className="vote-count">
                      {candidate.voteCount} votes ({percentage}%)
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

          <div className="total-votes">
            <strong>Total Votes: {totalVotes}</strong>
          </div>

          {!votingStatus.active && winner && (
            <div className="winner">
              <h3>Winner</h3>
              <p className="winner-name">{winner.name}</p>
              <p className="winner-votes">{winner.voteCount} votes</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Results;
