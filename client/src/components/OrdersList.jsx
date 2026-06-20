import { useState, useEffect } from 'react';
import axios from 'axios';

function OrdersList() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/orders`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Order delete karna hai?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/orders/${id}`);
        fetchOrders();
      } catch (error) {
        alert('Error: Order delete nahi hua!');
      }
    }
  };

  const statusColors = {
    pending: 'bg-yellow-200 text-yellow-800',
    confirmed: 'bg-blue-200 text-blue-800',
    preparing: 'bg-orange-200 text-orange-800',
    ready: 'bg-purple-200 text-purple-800',
    delivered: 'bg-green-200 text-green-800',
    cancelled: 'bg-red-200 text-red-800',
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">📋 Orders</h2>
        <button onClick={fetchOrders} className="bg-gray-700 text-white px-4 py-1 rounded">
          🔄 Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{order.customerName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-2 border-t pt-2">
                {order.items.map((item, i) => (
                  <p key={i} className="text-sm">
                    {item.name} x {item.quantity} — Rs. {item.price * item.quantity}
                  </p>
                ))}
              </div>

              <p className="text-right font-bold mt-2">Total: Rs. {order.totalAmount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersList;