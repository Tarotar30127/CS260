import React from 'react';
import './addjob.css';

export function Job({ onAddJob }) {
  const [newJob, setNewJob] = React.useState({
    title: '',
    description: '',
  });

  const handleAddJob = (e) => {
    e.preventDefault();
    onAddJob(newJob); // Pass the new job to the parent component
    setNewJob({ title: '', description: '' }); // Reset form
  };

  return (
    <div className="add-job-container">
      <h2>Add New Job</h2>
      <form onSubmit={handleAddJob}>
        <div className="mb-3">
          <label htmlFor="jobTitle" className="form-label">Title:</label>
          <input
            id="jobTitle"
            type="text"
            className="form-control"
            placeholder="Job Title"
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="jobDescription" className="form-label">Details:</label>
          <textarea
            id="jobDescription"
            className="form-control"
            placeholder="Job Description"
            value={newJob.description}
            onChange={(e) =>
              setNewJob({ ...newJob, description: e.target.value })
            }
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Job</button>
      </form>
    </div>
  );
};

