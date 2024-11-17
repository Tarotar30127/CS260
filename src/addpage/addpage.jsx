import React, { useState } from 'react';
import './addpage.css';

export function Add() {
  const [newInventoryItem, setNewInventoryItem] = useState({
    item: '',
    icn: '',
    client: '',
  });

  const handleAddInventory = (e) => {
    e.preventDefault();

    fetch('/api/inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newInventoryItem),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Inventory item added:', data);
        setNewInventoryItem({ item: '', icn: '', client: '' }); // Reset inventory form
      })
      .catch((error) => console.error('Error adding inventory item:', error));
  };

  return (
    <main>
      <div className="add-inventory-container">
        <h2>Add Inventory Item</h2>
        <form onSubmit={handleAddInventory}>
          <label htmlFor="inventory-item">Item:</label>
          <input
            id="inventory-item"
            type="text"
            placeholder="Item"
            value={newInventoryItem.item}
            onChange={(e) =>
              setNewInventoryItem({ ...newInventoryItem, item: e.target.value })
            }
            required
            className="form-control"
          />
          <label htmlFor="inventory-icn">ICN:</label>
          <input
            id="inventory-icn"
            type="text"
            placeholder="ICN"
            value={newInventoryItem.icn}
            onChange={(e) =>
              setNewInventoryItem({ ...newInventoryItem, icn: e.target.value })
            }
            required
            className="form-control"
          />
          <label htmlFor="inventory-client">Client:</label>
          <input
            id="inventory-client"
            type="text"
            placeholder="Client"
            value={newInventoryItem.client}
            onChange={(e) =>
              setNewInventoryItem({ ...newInventoryItem, client: e.target.value })
            }
            required
            className="form-control"
          />
          <button type="submit">Add Item</button>
        </form>
      </div>
    </main>
  );
}
