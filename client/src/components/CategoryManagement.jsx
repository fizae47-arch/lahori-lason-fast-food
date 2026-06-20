import { useState, useEffect } from 'react';
import axios from 'axios';

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchCategories = () => {
    axios.get(`${API_URL}/api/menu/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await axios.post(`${API_URL}/api/menu/categories`, { name });
      setName('');
      fetchCategories();
    } catch (error) {
      alert('Error: Category add nahi hui! Shayad yeh naam already exist karta hai.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Category delete karni hai? (Isse uski items affected ho sakti hain)')) {
      try {
        await axios.delete(`${API_URL}/api/menu/categories/${id}`);
        fetchCategories();
      } catch (error) {
        alert('Error: Category delete nahi hui!');
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📁 Category Management</h2>

      <form onSubmit={handleAdd} className="bg-white p-4 rounded-lg shadow mb-6 flex gap-2">
        <input
          type="text"
          placeholder="New Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border p-2 rounded"
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-bold">
          Add
        </button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-white p-3 rounded-lg shadow flex justify-between items-center">
            <span className="font-semibold">{cat.name}</span>
            <button
              onClick={() => handleDelete(cat._id)}
              className="bg-red-500 text-white px-2 py-1 rounded text-sm"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryManagement;