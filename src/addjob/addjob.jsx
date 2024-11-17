import React from 'react';
import './addjob.css';

export function Job() {
  const [newJob, setNewJob] = React.useState({
    title: '',
    description: '',
  });

  const handleAddJob = (e) => {
    e.preventDefault();

    // Send the new job to the server via POST request
    fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newJob),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Job added:', data);
        setNewJob({ title: '', description: '' }); // Reset form
      })
      .catch((error) => console.error('Error adding job:', error));
  };

  return (
    <main>
      <div className="add-job-container">
        <h2>Add New Job</h2>
        <form onSubmit={handleAddJob}>
          <label htmlFor="title">Job Title:</label>
          <input
            id="title"
            type="text"
            placeholder="Job Title"
            value={newJob.title}
            onChange={(e) =>
              setNewJob({ ...newJob, title: e.target.value })
            }
            required
            className="form-control"
          />
          <label htmlFor="description">Description:</label>
          <input
            id="description"
            type="text"
            placeholder="Job Description"
            value={newJob.description}
            onChange={(e) =>
              setNewJob({ ...newJob, description: e.target.value })
            }
            required
            className="form-control"
          />
          <button type="submit">Add Job</button>
        </form>
      </div>
    </main>
  );
};

