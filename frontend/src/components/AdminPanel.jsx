import { useState } from 'react';

function AdminPanel({ contract, votingStatus, onUpdate }) {
  const [candidateName, setCandidateName] = useState('');
  const [duration, setDuration] = useState(60);
  const [loading, setLoading] = useState(false);

  const addCandidate = async (e) => {
    e.preventDefault();
    if (!candidateName.trim()) return;

    setLoading(true);
    try {
      const tx = await contract.addCandidate(candidateName);
      await tx.wait();
      setCandidateName('');
      alert('Candidate added successfully!');
      onUpdate();
    } catch (error) {
      console.error('Error adding candidate:', error);
      alert('Error adding candidate: ' + error.message);
    }
    setLoading(false);
  };

  const startVoting = async () => {
    setLoading(true);
    try {
      const tx = await contract.startVoting(duration);
      await tx.wait();
      alert('Voting started successfully!');
      onUpdate();
    } catch (error) {
      console.error('Error starting voting:', error);
      alert('Error starting voting: ' + error.message);
    }
    setLoading(false);
  };

  const endVoting = async () => {
    setLoading(true);
    try {
      const tx = await contract.endVoting();
      await tx.wait();
      alert('Voting ended successfully!');
      onUpdate();
    } catch (error) {
      console.error('Error ending voting:', error);
      alert('Error ending voting: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>

      {!votingStatus.active && (
        <div className="admin-section">
          <h3>Add Candidate</h3>
          <form onSubmit={addCandidate}>
            <input
              type="text"
              placeholder="Candidate name"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Candidate'}
            </button>
          </form>
        </div>
      )}

      {!votingStatus.active && (
        <div className="admin-section">
          <h3>Start Voting</h3>
          <div className="duration-input">
            <label>
              Duration (minutes):
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                disabled={loading}
              />
            </label>
            <button onClick={startVoting} disabled={loading}>
              {loading ? 'Starting...' : 'Start Voting'}
            </button>
          </div>
        </div>
      )}

      {votingStatus.active && (
        <div className="admin-section">
          <h3>Voting is Active</h3>
          <p>End time: {new Date(votingStatus.endTime * 1000).toLocaleString()}</p>
          <button onClick={endVoting} disabled={loading} className="danger">
            {loading ? 'Ending...' : 'End Voting'}
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
