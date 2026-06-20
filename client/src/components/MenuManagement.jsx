import { useState, useEffect } from 'react';
import axios from 'axios';

function MenuManagement() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [hasSizes, setHasSizes] = useState(false);
  const [price, setPrice] = useState('');
  const [small, setSmall] = useState('');
  const [medium, setMedium] = useState('');
  const [large, setLarge] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchData = () => {
    axios.get(`${API_URL}/api/menu/items`).then((res) => setItems(res.data));
    axios.get(`${API_URL}/api/menu/categories`).then((res) => setCategories(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setName('');
    setCategory('');
    setHasSizes(false);
    setPrice('');
    setSmall('');
    setMedium('');
    setLarge('');
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemData = {
      name,
      category,
      ...(hasSizes
        ? { sizes: { small: Number(small), medium: Number(medium), large: Number(large) } }
        : { price: Number(price) }),
    };

    try {
      if (editingItem) {
        await axios.put(`${API_URL}/api/menu/items/${editingItem._id}`, itemData);
        alert('Item Updated! ✅');
      } else {
        await axios.post(`${API_URL}/api/menu/items`, itemData);
        alert('Item Added! ✅');
      }
      resetForm();
      fetchData();
    } catch (error) {
      alert('Error!');
      console.log(error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category?._id || '');
    if (item.sizes) {
      setHasSizes(true);
      setSmall(item.sizes.small);
      setMedium(item.sizes.medium);
      setLarge(item.sizes.large);
    } else {
      setHasSizes(false);
      setPrice(item.price);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Item delete karna hai?')) {
      await axios.delete(`${API_URL}/api/menu/items/${id}`);
      fetchData();
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🍔 Menu Management</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6 space-y-3">
        <h3 className="font-bold text-lg">{editingItem ? 'Edit Item' : 'Add New Item'}</h3>

        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={hasSizes}
            onChange={(e) => setHasSizes(e.target.checked)}
          />
          Has Sizes (Pizza jaisa)?
        </label>

        {hasSizes ? (
          <div className="flex gap-2">
            <input type="number" placeholder="Small" value={small} onChange={(e) => setSmall(e.target.value)} className="border p-2 rounded w-1/3" required />
            <input type="number" placeholder="Medium" value={medium} onChange={(e) => setMedium(e.target.value)} className="border p-2 rounded w-1/3" required />
            <input type="number" placeholder="Large" value={large} onChange={(e) => setLarge(e.target.value)} className="border p-2 rounded w-1/3" required />
          </div>
        ) : (
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        )}

        <div className="flex gap-2">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-bold">
            {editingItem ? 'Update Item' : 'Add Item'}
          </button>
          {editingItem && (
            <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item._id} className="bg-white p-3 rounded-lg shadow">
            <h4 className="font-bold">{item.name}</h4>
            <p className="text-sm text-gray-500">{item.category?.name}</p>
            {item.price && <p className="text-red-600">Rs. {item.price}</p>}
            {item.sizes && (
              <p className="text-sm text-red-600">
                S:{item.sizes.small} M:{item.sizes.medium} L:{item.sizes.large}
              </p>
            )}
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(item)} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                Edit
              </button>
              <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuManagement;