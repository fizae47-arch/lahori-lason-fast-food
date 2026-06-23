import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Deals({ addToCart }) {
  const [deals, setDeals] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dealRefs = useRef([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/deals`)
      .then((res) => setDeals(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleAddDeal = (deal) => {
    addToCart({ _id: deal._id, name: deal.name }, deal.price);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') return;
      }

      if (deals.length === 0) return;

      const columns = window.innerWidth >= 768 ? 3 : window.innerWidth >= 640 ? 2 : 1;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, deals.length - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + columns, deals.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - columns, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const deal = deals[selectedIndex];
        if (deal) {
          handleAddDeal(deal);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deals, selectedIndex]);

  // Selected deal ko view mein scroll karo
  useEffect(() => {
    if (dealRefs.current[selectedIndex]) {
      dealRefs.current[selectedIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🎯 Deals</h2>

      <p className="text-xs text-gray-500 mb-2">
        💡 Arrow keys se navigate karo, Enter dabake add karo
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {deals.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">Koi Deal Available Nahi</p>
        ) : (
          deals.map((deal, index) => (
            <div
              key={deal._id}
              ref={(el) => (dealRefs.current[index] = el)}
              className={`p-4 rounded-lg shadow border-2 cursor-pointer transition-all ${
                index === selectedIndex
                  ? 'bg-yellow-300 border-4 border-red-500 scale-105'
                  : 'bg-yellow-100 border-yellow-400'
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <h3 className="font-bold text-lg">{deal.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{deal.items}</p>
              <button
                onClick={() => handleAddDeal(deal)}
                className="mt-3 w-full bg-red-500 text-white px-3 py-2 rounded font-bold hover:bg-red-600"
              >
                Add - Rs. {deal.price}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Deals;