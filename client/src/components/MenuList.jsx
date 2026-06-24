import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

function MenuList({ addToCart, resetSearchTrigger }) {
  const [items, setItems] = useState([]);
  const [deals, setDeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedItems, setSearchedItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const itemRefs = useRef([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${API_URL}/api/menu/items`)
      .then((res) => setItems(res.data))
      .catch((err) => console.log(err));

    axios.get(`${API_URL}/api/deals`)
      .then((res) => setDeals(res.data))
      .catch((err) => console.log(err));
  }, []);

  const sortedItems = [...items];

  const combinedList = [
    ...sortedItems.map((item) => ({ ...item, _type: 'menu' })),
    ...deals.map((deal) => ({ ...deal, _type: 'deal' })),
  ];

  const filteredItems =
    searchTerm.trim() !== ''
      ? combinedList.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : searchedItems.length > 0
        ? searchedItems
        : combinedList;

  // ✅ useCallback se stable reference - stale closure problem fix
  const handleAdd = useCallback((item) => {
    if (!item) return;
    if (item._type === 'deal') {
      addToCart({ _id: item._id, name: item.name }, item.price);
    } else if (item.price) {
      addToCart(item, item.price);
    } else if (item.sizes) {
      addToCart(item, item.sizes.small);
    }
  }, [addToCart]);

  // ✅ filteredItems ko ref mein rakho taake useEffect mein hamesha latest mile
  const filteredItemsRef = useRef(filteredItems);
  useEffect(() => {
    filteredItemsRef.current = filteredItems;
  });

  const selectedIndexRef = useRef(selectedIndex);
  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      const currentItems = filteredItemsRef.current;
      const currentIndex = selectedIndexRef.current;

      if (currentItems.length === 0) return;

      const columns = window.innerWidth >= 768 ? 3 : window.innerWidth >= 640 ? 2 : 1;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, currentItems.length - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + columns, currentItems.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - columns, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = currentItems[currentIndex]; // ✅ ref se latest item lo
        if (item) handleAdd(item);
        setSearchTerm('');
        // ✅ selectedIndex reset nahi - same item dobara Enter se add hoga
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAdd]); // ✅ Sirf handleAdd dependency, baki sab ref se

  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedIndex]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() !== '') {
      const filtered = combinedList.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchedItems(filtered);
    }
  };

  useEffect(() => {
    setSearchTerm('');
    setSearchedItems([]);
  }, [resetSearchTrigger]);

  return (
    <div className="p-4 print:hidden">
      <h2 className="text-2xl font-bold mb-4">Menu & Deals</h2>

      <input
        type="text"
        placeholder="🔍 Search item or deal..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full border-2 border-yellow-400 p-3 rounded-lg mb-4 focus:outline-none focus:border-red-500"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredItems.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">No items found</p>
        ) : (
          filteredItems.map((item, index) => (
            <div
              key={item._id}
              ref={(el) => (itemRefs.current[index] = el)}
              className={`p-4 rounded-lg shadow cursor-pointer transition-all border-4 ${
                index === selectedIndex
                  ? 'bg-yellow-300 border-red-500 scale-105'
                  : item._type === 'deal'
                  ? 'bg-orange-100 border-orange-400'
                  : 'bg-yellow-100 border-transparent'
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              {item._type === 'deal' && (
                <span className="text-xs font-bold text-orange-600">🎯 DEAL</span>
              )}
              <h3 className="font-bold text-lg">{item.name}</h3>

              {item._type === 'deal' ? (
                <>
                  <p className="text-sm text-gray-600 mt-1">{item.items}</p>
                  <button
                    onClick={() => handleAdd(item)}
                    className="mt-2 w-full bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                  >
                    Add - Rs. {item.price}
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MenuList;