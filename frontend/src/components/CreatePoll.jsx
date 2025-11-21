import { useState } from 'react';

function CreatePoll({ contract, onUpdate }) {
  const [title, setTitle] = useState('');
  const [dateOptions, setDateOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);

  const addDateField = () => {
    setDateOptions([...dateOptions, '']);
  };

  const removeDateField = (index) => {
    if (dateOptions.length > 2) {
      const newDates = dateOptions.filter((_, i) => i !== index);
      setDateOptions(newDates);
    }
  };

  const updateDate = (index, value) => {
    const newDates = [...dateOptions];
    newDates[index] = value;
    setDateOptions(newDates);
  };

  const createPoll = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a poll title');
      return;
    }

    const validDates = dateOptions.filter(d => d.trim());
    if (validDates.length < 2) {
      alert('Please add at least 2 date options');
      return;
    }

    setLoading(true);
    try {
      // Convert dates to timestamps and display strings
      const timestamps = [];
      const displayDates = [];

      for (const dateStr of validDates) {
        const date = new Date(dateStr);
        timestamps.push(Math.floor(date.getTime() / 1000));
        // Format: "Jan 15, 2024 at 2:00 PM"
        displayDates.push(date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }));
      }

      console.log('Creating poll:', { title, timestamps, displayDates });
      const tx = await contract.createPoll(title, timestamps, displayDates);
      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      console.log('Transaction confirmed');

      alert('Poll created successfully!');
      setTitle('');
      setDateOptions(['', '']);
      onUpdate();
    } catch (error) {
      console.error('Error creating poll:', error);
      alert('Error creating poll: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="create-poll">
      <h2>Create New Date Poll</h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Create a poll to let people vote on the best date for your event or meeting.
      </p>
      <form onSubmit={createPoll}>
        <div className="form-group">
          <label>Poll Title</label>
          <input
            type="text"
            placeholder="e.g., When should we meet for the team lunch?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Date Options (people will vote on these)</label>
          {dateOptions.map((dateOption, index) => (
            <div key={index} className="candidate-input">
              <input
                type="datetime-local"
                value={dateOption}
                onChange={(e) => updateDate(index, e.target.value)}
                disabled={loading}
              />
              {dateOptions.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeDateField(index)}
                  disabled={loading}
                  className="remove-btn"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addDateField}
            disabled={loading}
            className="add-btn"
          >
            + Add Another Date Option
          </button>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Creating Poll...' : 'Create Poll'}
        </button>
      </form>
    </div>
  );
}

export default CreatePoll;
