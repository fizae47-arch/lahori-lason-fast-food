import { useState, useEffect } from 'react';
import axios from 'axios';

function DealManagement() {
  const [deals, setDeals] = useState([]);
  const [editingDeal, setEditingDeal] = useState(null);

  const [name, setName] = useState('');
  const [items, setItems] = useState('');
  const [price, setPrice] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchDeals = () => {
    axios.get(`${API_URL}/api/deals`)
      .then((res) => setDeals(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const resetForm = () => {
    setName('');
    setItems('');
    setPrice('');
    setEditingDeal(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dealData = { name, items, price: Number(price) };

    try {
      if (editingDeal) {
        await axios.put(`${API_URL}/api/deals/${editingDeal._id}`, dealData);
        alert('Deal Updated! ✅');
      } else {
        await axios.post(`${API_URL}/api/deals`, dealData);
        alert('Deal Added! ✅');
      }
      resetForm();
      fetchDeals();
    } catch (error) {
      alert('Error!');
      console.log(error);
    }
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setName(deal.name);
    setItems(deal.items);
    setPrice(deal.price);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deal delete karna hai?')) {
      await axios.delete(`${API_URL}/api/deals/${id}`);
      fetchDeals();
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🎯 Deal Management</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6 space-y-3">
        <h3 className="font-bold text-lg">{editingDeal ? 'Edit Deal' : 'Add New Deal'}</h3>

        <input
          type="text"
          placeholder="Deal Name (e.g. Deal 01)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          placeholder="Items (e.g. 1 Small Pizza, 1 Zinger Paratha Roll, Fries, Tin Pack Bottle)"
          value={items}
          onChange={(e) => setItems(e.target.value)}
          className="w-full border p-2 rounded"
          rows="3"
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <div className="flex gap-2">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-bold">
            {editingDeal ? 'Update Deal' : 'Add Deal'}
          </button>
          {editingDeal && (
            <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {deals.map((deal) => (
          <div key={deal._id} className="bg-white p-3 rounded-lg shadow">
            <h4 className="font-bold">{deal.name}</h4>
            <p className="text-sm text-gray-500">{deal.items}</p>
            <p className="text-red-600 font-bold">Rs. {deal.price}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(deal)} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                Edit
              </button>
              <button onClick={() => handleDelete(deal._id)} className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DealManagement;