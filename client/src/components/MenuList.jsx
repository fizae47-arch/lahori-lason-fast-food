import { useState, useEffect } from 'react';
import axios from 'axios';

function MenuList({ addToCart }) {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/menu/items`)
      .then((res) => setItems(res.data))
      .catch((err) => console.log(err));
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Menu Items</h2>

      <input
        type="text"
        placeholder="🔍 Search item..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border-2 border-yellow-400 p-3 rounded-lg mb-4 focus:outline-none focus:border-red-500"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredItems.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">No items found</p>
        ) : (
          filteredItems.map((item) => (
            <div key={item._id} className="bg-yellow-100 p-4 rounded-lg shadow">
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.category?.name}</p>

              {item.price && (
                <button
                  onClick={() => addToCart(item, item.price)}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Add - Rs. {item.price}
                </button>
              )}

              {item.sizes && (
                <div className="flex flex-col gap-1 mt-2">
                  <button
                    onClick={() => addToCart(item, item.sizes.small)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Small - Rs. {item.sizes.small}
                  </button>
                  <button
                    onClick={() => addToCart(item, item.sizes.medium)}
                    className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Medium - Rs. {item.sizes.medium}
                  </button>
                  <button
                    onClick={() => addToCart(item, item.sizes.large)}
                    className="bg-blue-700 text-white px-2 py-1 rounded text-sm"
                  >
                    Large - Rs. {item.sizes.large}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MenuList;