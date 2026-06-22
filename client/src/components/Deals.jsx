import { useState, useEffect } from 'react';
import axios from 'axios';

function Deals({ addToCart }) {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/deals`)
      .then((res) => setDeals(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleAddDeal = (deal) => {
    addToCart({ _id: deal._id, name: deal.name }, deal.price);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🎯 Deals</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {deals.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">Koi Deal Available Nahi</p>
        ) : (
          deals.map((deal) => (
            <div key={deal._id} className="bg-yellow-100 p-4 rounded-lg shadow border-2 border-yellow-400">
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