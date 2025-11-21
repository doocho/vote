function PollsList({ polls, onSelectPoll, account }) {
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getStatusColor = (active) => {
    return active ? '#4caf50' : '#9e9e9e';
  };

  if (polls.length === 0) {
    return (
      <div className="polls-list">
        <h2>All Date Polls</h2>
        <div style={{ textAlign: 'center', padding: '40px', background: '#f8f9fa', borderRadius: '15px' }}>
          <p>No polls created yet. Be the first to create one!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="polls-list">
      <h2>All Date Polls</h2>
      <div className="polls-grid">
        {polls.map((poll) => {
          const isCreator = poll.creator.toLowerCase() === account.toLowerCase();

          return (
            <div key={poll.id} className="poll-card" onClick={() => onSelectPoll(poll.id)}>
              <div className="poll-header">
                <h3>{poll.title}</h3>
                <span
                  className="poll-status"
                  style={{ backgroundColor: getStatusColor(poll.active) }}
                >
                  {poll.active ? 'Active' : 'Closed'}
                </span>
              </div>
              <div className="poll-info">
                <p><strong>Created:</strong> {formatDate(poll.createdAt)}</p>
                <p><strong>By:</strong> {isCreator ? 'You' : `${poll.creator.substring(0, 6)}...${poll.creator.substring(38)}`}</p>
              </div>
              <button className="view-poll-btn">View & Vote</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PollsList;
