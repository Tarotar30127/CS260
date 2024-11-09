import React, { useState } from 'react';
import './addpage.css';

export function Add({ onAddItem }) {
  const [newInventoryItem, setNewInventoryItem] = useState({
    item: '',
    icn: '',
    client: '',
  });

  const handleAddInventory = (e) => {
    e.preventDefault();
    onAddItem(newInventoryItem); // Pass the new item to the parent component
    setNewInventoryItem({ item: '', icn: '', client: '' }); // Reset form
  };

  return (
    <div>
      <h2>Add Inventory Item</h2>
      <form onSubmit={handleAddInventory}>
        <input
          type="text"
          placeholder="Item"
          value={newInventoryItem.item}
          onChange={(e) =>
            setNewInventoryItem({ ...newInventoryItem, item: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="ICN"
          value={newInventoryItem.icn}
          onChange={(e) =>
            setNewInventoryItem({ ...newInventoryItem, icn: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Client"
          value={newInventoryItem.client}
          onChange={(e) =>
            setNewInventoryItem({ ...newInventoryItem, client: e.target.value })
          }
          required
        />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};


