import { useState, useEffect } from 'react';
import axios from 'axios';

function OrdersList() {
  const [orders, setOrders] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchOrders = () => {
    axios.get(`${API_URL}/api/orders`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Order delete karna hai?')) {
      try {
        await axios.delete(`${API_URL}/api/orders/${id}`);
        fetchOrders();
      } catch (error) {
        alert('Error: Order delete nahi hua!');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/orders/${id}`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      alert('Error: Status update nahi hua!');
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

  const today = new Date().toDateString();
  const todaysOrders = orders.filter(
    (order) => new Date(order.createdAt).toDateString() === today
  );

  const todaysEarning = todaysOrders
    .filter((order) => order.status === 'delivered')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const totalEarning = orders
    .filter((order) => order.status === 'delivered')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">📋 Orders</h2>
        <button onClick={fetchOrders} className="bg-gray-700 text-white px-4 py-1 rounded">
          🔄 Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <div className="bg-green-600 text-white p-4 rounded-lg shadow">
          <p className="text-sm opacity-80">Today Earnings ({new Date().toLocaleDateString()})</p>
          <p className="text-2xl font-bold">Rs. {todaysEarning}</p>
          <p className="text-xs opacity-70">{todaysOrders.length} orders today</p>
        </div>
        <div className="bg-blue-600 text-white p-4 rounded-lg shadow">
          <p className="text-sm opacity-80">Total Earning (All Time)</p>
          <p className="text-2xl font-bold">Rs. {totalEarning}</p>
          <p className="text-xs opacity-70">{orders.length} total orders</p>
        </div>
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
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold border-0 ${statusColors[order.status]}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
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