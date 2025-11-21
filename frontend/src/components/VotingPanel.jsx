import { useState } from 'react';

function VotingPanel({ contract, candidates, hasVoted, onVote }) {
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [loading, setLoading] = useState(false);

  const castVote = async (e) => {
    e.preventDefault();
    if (!selectedCandidate) {
      alert('Please select a candidate');
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.vote(selectedCandidate);
      await tx.wait();
      alert('Vote cast successfully!');
      onVote();
    } catch (error) {
      console.error('Error casting vote:', error);
      alert('Error casting vote: ' + error.message);
    }
    setLoading(false);
  };

  if (hasVoted) {
    return (
      <div className="voting-panel">
        <h2>You have already voted</h2>
        <p>Thank you for participating!</p>
      </div>
    );
  }

  return (
    <div className="voting-panel">
      <h2>Cast Your Vote</h2>
      <form onSubmit={castVote}>
        <div className="candidates-list">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="candidate-option">
              <label>
                <input
                  type="radio"
                  name="candidate"
                  value={candidate.id}
                  onChange={(e) => setSelectedCandidate(e.target.value)}
                  disabled={loading}
                />
                <span className="candidate-name">{candidate.name}</span>
              </label>
            </div>
          ))}
        </div>
        <button type="submit" disabled={loading || !selectedCandidate}>
          {loading ? 'Voting...' : 'Cast Vote'}
        </button>
      </form>
    </div>
  );
}

export default VotingPanel;
