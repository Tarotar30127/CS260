import React from 'react';
import './home.css';

export function Home() {
  // Sample inventory and jobs data
  const [inventoryItems, setInventoryItems] = React.useState([
    { item: 'Macbook', icn: '1-130485', client: 'Conner' },
    { item: 'Mac Air', icn: '1-130486', client: 'Ron' },
    { item: 'Macbook', icn: '1-130487', client: 'Bob' },
  ]);

  const [jobsList, setJobsList] = React.useState([
    {
      title: 'Help Professor Joe with Printer',
      description: 'Printer ran out of toner',
    },
    {
      title: 'Add software to lab 091',
      description: 'Class facepager',
    },
    {
      title: 'Add new employee',
      description: 'Needs access to emails',
    },
  ]);

  // State for active job description visibility
  const [activeJob, setActiveJob] = React.useState(null);

  // State for adding new inventory item
  const [newInventoryItem, setNewInventoryItem] = React.useState({
    item: '',
    icn: '',
    client: '',
  });

  // State for adding new job
  const [newJob, setNewJob] = React.useState({
    title: '',
    description: '',
  });

  // Toggle job description visibility
  const toggleJobDescription = (index) => {
    setActiveJob((prevState) => (prevState === index ? null : index));
  };

  // Handle adding inventory item
  const handleAddInventory = (e) => {
    e.preventDefault();
    setInventoryItems((prevItems) => [...prevItems, newInventoryItem]);
    setNewInventoryItem({ item: '', icn: '', client: '' }); // Reset form
  };

  // Handle adding job
  const handleAddJob = (e) => {
    e.preventDefault();
    setJobsList((prevJobs) => [...prevJobs, newJob]);
    setNewJob({ title: '', description: '' }); // Reset form
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
            {inventoryItems.map((item, index) => (
              <tr key={index}>
                <td>{item.item}</td>
                <td>{item.icn}</td>
                <td>{item.client}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Jobs Section */}
      <div className="jobs">
        <h2>Current Jobs</h2>
        {jobsList.map((job, index) => (
          <div className="job" key={index}>
            <div className="job-title" onClick={() => toggleJobDescription(index)}>
              <span className="toggle-icon">{activeJob === index ? '-' : '+'}</span>
              {job.title}
            </div>
            {activeJob === index && (
              <div className="job-description">
                {job.description}
              </div>
            )}
          </div>
        ))}

        
      </div>
    </main>
  );
};


