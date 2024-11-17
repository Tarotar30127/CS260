import React from 'react';
import './home.css';

export function Home() {
  const [inventoryItems, setInventoryItems] = React.useState([]);
  const [jobsList, setJobsList] = React.useState([]);
  const [activeJob, setActiveJob] = React.useState(null);

  React.useEffect(() => {
    // Fetch inventory items from the API
    fetch('/api/inventory')
      .then((response) => response.json())
      .then((data) => setInventoryItems(data))
      .catch((error) => console.error('Error fetching inventory:', error));

    // Fetch jobs from the API
    fetch('/api/jobs')
      .then((response) => response.json())
      .then((data) => setJobsList(data))
      .catch((error) => console.error('Error fetching jobs:', error));
  }, []);

  const toggleJobDescription = (index) => {
    setActiveJob((prevState) => (prevState === index ? null : index));
  };

  return (
    <main>
      {/* Inventory List */}
      <div className="inventory">
        <h2>Inventory List</h2>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>ICN</th>
              <th>Client</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.length > 0 ? (
              inventoryItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.item}</td>
                  <td>{item.icn}</td>
                  <td>{item.client}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No inventory available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Jobs Section */}
      <div className="jobs">
        <h2>Current Jobs</h2>
        {jobsList.length > 0 ? (
          jobsList.map((job, index) => (
            <div className="job" key={index}>
              <div className="job-title" onClick={() => toggleJobDescription(index)}>
                <span className="toggle-icon">{activeJob === index ? '-' : '+'}</span>
                {job.title}
              </div>
              {activeJob === index && (
                <div className="job-description">{job.description}</div>
              )}
            </div>
          ))
        ) : (
          <p>No jobs available</p>
        )}
      </div>
    </main>
  );
}
